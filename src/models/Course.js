// src/models/Course.js

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required.'],
    trim: true,
  },
  semester: {
    type: String,
    required: [true, 'Semester is required.'],
    enum: ['First', 'Second'], // Adjust based on your academic calendar
  },
  enrolled: {
    type: Number,
    required: [true, 'Number of enrolled students is required.'],
    min: [0, 'Enrolled students cannot be negative.'],
    default: 0,
  },
  capacity: { // Added capacity field
    type: Number,
    required: [true, 'Course capacity is required.'],
    min: [1, 'Capacity must be at least 1.'],
    default: 30,
  },
  isOversize: {
    type: Boolean,
    default: false,
  },
  oversizeStudentCount: { // New field for oversize courses
    type: Number,
    min: [0, 'Student count cannot be negative.'],
    default: 0,
  },
  isOverload: {
    type: Boolean,
    default: false,
  },
  overloadType: { // Added field to specify Master or Bachelor
    type: String,
    enum: ['Masters', 'Bachelor'],
    required: function() { return this.isOverload; },
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Paid'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
