// src/controllers/authController.js

const path = require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * Register a new user (Lecturer)
 */
exports.register = async (req, res) => {
  const { name, email, password, bankName, bankAccountNumber, bankBBAN, school } = req.body;

  // Basic validation
  if (!name || !email || !password || !bankName || !bankAccountNumber || !bankBBAN || !school) {
    logger.warn('Registration failed: Missing required fields.');
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed: Email already in use - ${email}`);
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      bankName: bankName.trim(),
      bankAccountNumber: bankAccountNumber.trim(),
      bankBBAN: bankBBAN.trim(),
      school: school.trim(),
      role: 'User', // Default role for Lecturers
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const payload = { id: newUser._id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );

    logger.info(`New user registered: ${email}`);

    // Respond with token and user info
    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        school: newUser.school,
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      logger.error(`Registration validation error: ${messages.join('. ')}`);
      return res.status(400).json({ message: messages.join('. ') });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      logger.warn(`Duplicate registration attempt: ${JSON.stringify(error.keyValue)}`);
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Handle other errors
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * Authenticate user and return token
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    logger.warn('Login failed: Missing email or password.');
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email and include the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn(`Login failed: User not found - ${email}`);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare provided password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password - ${email}`);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const payload = { id: user._id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );

    logger.info(`User logged in: ${email}`);

    // Respond with token and user info
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
