// src/routes/notifications.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorizeRoles } = require('../middleware/auth'); // Correctly import middleware

// @route   POST /api/notifications
// @desc    Send a notification (QA only)
// @access  Private (QA)
router.post(
  '/',
  authenticate,                     // Authenticate the user
  authorizeRoles('QA'),             // Authorize only users with 'QA' role
  notificationController.sendNotification
);

module.exports = router;
