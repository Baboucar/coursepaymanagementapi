// src/controllers/adminController.js

const path = require('path');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * Assign 'QA' role to a user
 * @route POST /api/admin/assign-role
 * @access Private (QA)
 */
exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;

  // Basic validation
  if (!userId || !role) {
    return res.status(400).json({ message: 'User ID and role are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update role
    user.role = role;
    await user.save();

    // Optionally, send an email notification to the user about role change
    await sendEmail(
      user.email,
      'Role Assignment Notification',
      `Hello ${user.name},

Your role has been updated to '${role}'.

Best regards,
HProject Team`
    );

    logger.info(`User role updated to '${role}' for user: ${user.email}`);

    res.status(200).json({ message: `User role updated to '${role}'.`, user });
  } catch (error) {
    logger.error(`Error assigning role: ${error.message}`);
    res.status(500).json({ message: 'Server error while assigning role.' });
  }
};

/**
 * Create a new QA user
 * @route POST /api/admin/create-qa
 * @access Private (QA)
 */
exports.createQAUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  // Check if email is UTG domain
  const utgEmailRegex = /@utg\.edu\.gm$/;
  if (!utgEmailRegex.test(email)) {
    return res.status(400).json({ message: 'Please use a valid UTG email address.' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Create new QA user
    user = new User({
      name,
      email,
      password,
      role: 'QA',
      bankName: 'Default Bank', // Add default bank details or use provided ones if any
      bankAccountNumber: '00000000',
      bankBBAN: '0000000000',
      school: 'N/A', // QA might not need a school
    });

    await user.save();

    // Generate JWT
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_here', {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'QA user created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error(`Error in creating QA user: ${err.message}`);
    res.status(500).json({ message: 'Server error during QA user creation.' });
  }
};

/**
 * Send notifications to users (Lecturers)
 * @route POST /api/admin/send-notification
 * @access Private (QA)
 */
exports.sendNotification = async (req, res) => {
  const { message } = req.body;

  // Basic validation
  if (!message) {
    return res.status(400).json({ message: 'Notification message is required.' });
  }

  try {
    // Fetch all users (assuming role 'User' are lecturers)
    const users = await User.find({ role: 'User' });

    if (users.length === 0) {
      return res.status(200).json({ message: 'No users to send notifications to.' });
    }

    // Send emails to all users
    const emailPromises = users.map(user =>
      sendEmail(
        user.email,
        'Notification from QA',
        `Hello ${user.name},\n\n${message}\n\nBest regards,\nQA Team`
      )
    );

    await Promise.all(emailPromises);

    res.status(200).json({ message: 'Notifications sent successfully.' });
  } catch (error) {
    logger.error(`Error sending notifications: ${error.message}`);
    res.status(500).json({ message: 'Server error while sending notifications.' });
  }
};

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Private (QA)
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.status(200).json({ users });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};
