// src/routes/courses.js

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Get all courses
router.get('/', authenticate, courseController.getAllCourses);

// Create a new course
router.post('/', authenticate, authorizeRoles('User', 'QA'), courseController.createCourse);

// Edit a course
router.put('/:id', authenticate, authorizeRoles('User', 'QA'), courseController.editCourse);

// Approve a course
router.patch('/:id/approve', authenticate, authorizeRoles('QA'), courseController.approveCourse);

// Get a single course
router.get('/:id', authenticate, courseController.getCourseById);

module.exports = router;
