// src/routes/admin.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Import Middleware
const { authenticate, authorizeRoles } = require('../middleware/auth');

// @route   POST /api/admin/assign-role
// @desc    Assign 'QA' role to a user
// @access  Private (QA)
router.post(
  '/assign-role',
  authenticate,               // Middleware to authenticate user
  authorizeRoles('QA'),       // Middleware to authorize user with 'QA' role
  adminController.assignRole  // Controller function to handle the request
);

// @route   POST /api/admin/send-notification
// @desc    Send notifications to users
// @access  Private (QA)
router.post(
  '/send-notification',
  authenticate,                     // Middleware to authenticate user
  authorizeRoles('QA'),             // Middleware to authorize user with 'QA' role
  adminController.sendNotification  // Controller function to handle the request
);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (QA)
router.get(
  '/users',
  authenticate,          // Middleware to authenticate user
  authorizeRoles('QA'),  // Middleware to authorize user with 'QA' role
  adminController.getUsers
);

// @route   POST /api/admin/create-qa
// @desc    Create a new QA user
// @access  Private (QA)
router.post(
  '/create-qa',
  authenticate,              // Middleware to authenticate user
  authorizeRoles('QA'),      // Middleware to authorize user with 'QA' role
  adminController.createQAUser
);

module.exports = router;
