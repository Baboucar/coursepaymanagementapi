// src/controllers/notificationController.js
const path = require('path');

const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * Send a notification
 * @route POST /api/notifications
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
