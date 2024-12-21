// src/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user (Lecturer)
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user and return token
// @access  Public
router.post('/login', authController.login);

module.exports = router;
