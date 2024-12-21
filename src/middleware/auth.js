// src/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * Authenticate user by verifying JWT token
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer TOKEN"

  if (!token) {
    logger.warn('Authentication failed: No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      logger.warn('Authentication failed: User not found.');
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

/**
 * Authorize user based on role
 * @param  {...any} roles Allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Authorization failed: ${req.user ? req.user.role : 'Unknown role'} does not have access.`);
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
