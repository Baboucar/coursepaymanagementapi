// src/seed/seedQAAdmin.js

const User = require('../models/User');
const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Seed a QA Admin user if not already present.
 */
const seedQAAdmin = async () => {
  try {
    logger.info(`Seeding QAadmin with email: ${process.env.QAADMIN_EMAIL}`);
    logger.info(`Seeding QAadmin with plaintext password: ${process.env.QAADMIN_PASSWORD}`);

    // Check if QAadmin already exists
    const existingAdmin = await User.findOne({ email: process.env.QAADMIN_EMAIL.toLowerCase().trim() });
    if (existingAdmin) {
      logger.info('✅ QA Admin already exists.');
      return;
    }

    // Create QAadmin user with plaintext password (pre-save middleware will hash it)
    const admin = new User({
      name: process.env.QAADMIN_NAME.trim(),
      email: process.env.QAADMIN_EMAIL.toLowerCase().trim(),
      password: process.env.QAADMIN_PASSWORD.trim(), // Plaintext password
      role: 'QA',
      bankName: process.env.QAADMIN_BANK_NAME.trim(),
      bankAccountNumber: process.env.QAADMIN_BANK_ACCOUNT.trim(),
      bankBBAN: process.env.QAADMIN_BANK_BBAN.trim(),
    });

    // Save QAadmin to database (pre-save hook hashes the password)
    await admin.save();
    logger.info('✅ QA Admin seeded successfully.');
  } catch (error) {
    logger.error(`❌ Error seeding QA Admin: ${error.message}`);
  }
};

module.exports = seedQAAdmin;
