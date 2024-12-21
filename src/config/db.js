// src/config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Add any necessary options here
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
