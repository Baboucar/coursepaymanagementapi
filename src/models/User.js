// src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@utg\.edu\.gm$/, 'Please fill a valid UTG email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Ensure password is not returned by default
  },
  role: {
    type: String,
    enum: ['User', 'QA'], // 'User' for Lecturers, 'QA' for Admins
    default: 'User',
  },
  bankName: {
    type: String,
    required: [true, 'Bank Name is required'],
    trim: true,
  },
  bankAccountNumber: {
    type: String,
    required: [true, 'Bank Account Number is required'],
    trim: true,
  },
  bankBBAN: {
    type: String,
    required: [true, 'Bank BBAN is required'],
    trim: true,
  },
  school: { // New field
    type: String,
    required: [true, 'School is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to hash password if it's modified or new
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare entered password with hashed password in DB
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
