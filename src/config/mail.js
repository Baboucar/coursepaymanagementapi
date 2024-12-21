// src/config/mail.js

const nodemailer = require('nodemailer');
const getLogger = require('../utils/logger');
const path = require('path');

const logger = getLogger(path.basename(__filename));

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    logger.error(`Mail transporter verification failed: ${error.message}`);
  } else {
    logger.info('Mail transporter is ready to send emails');
  }
});

module.exports = transporter;
