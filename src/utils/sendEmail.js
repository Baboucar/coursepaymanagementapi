// src/utils/sendEmail.js

const transporter = require('../config/mail');
const path = require('path');
const logger = require('./logger')(path.basename(__filename));

/**
 * Send an email using the transporter
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 */
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw new Error(`Failed to send email to ${to}`);
  }
};

module.exports = sendEmail;
