// src/utils/logger.js

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

/**
 * Logger Factory Function
 * @param {string} label - Label for the logger
 */
const loggerFactory = (label) => {
  const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

  return createLogger({
    level: 'info',
    format: combine(
      colorize(),
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/combined.log' }),
    ],
  });
};

module.exports = loggerFactory;
