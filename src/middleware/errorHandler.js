// src/middleware/errorHandler.js

/**
 * Not Found Middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

/**
 * QA Role Authorization Middleware
 */
const authorizeQA = (req, res, next) => {
  if (!req.user || req.user.role !== 'QA') {
    return res.status(403).json({ error: 'Access denied. Only QA users are allowed.' });
  }
  next();
};

// Export the handlers
module.exports = { notFound, errorHandler, authorizeQA };
