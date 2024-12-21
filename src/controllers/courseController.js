const path = require('path');
const Course = require('../models/Course');
const logger = require('../utils/logger')(path.basename(__filename));

/**
 * Get all courses
 * @route GET /api/courses
 * @access Private (User, QA)
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('lecturer', 'name school');
    res.status(200).json({ courses });
  } catch (error) {
    logger.error(`Error fetching courses: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching courses.' });
  }
};

/**
 * Create a new course
 * @route POST /api/courses
 * @access Private (User, QA)
 *
 * Lecturers can set all fields including paymentStatus at creation, but usually paymentStatus defaults to 'Pending'.
 * If a lecturer sets paymentStatus at creation, it will be set, but remember only QA can change it after creation.
 */
exports.createCourse = async (req, res) => {
  const {
    title,
    semester,
    enrolled,
    capacity,
    isOversize,
    oversizeStudentCount,
    isOverload,
    overloadType,
    paymentStatus,
  } = req.body;

  if (!title || !semester || enrolled === undefined || capacity === undefined) {
    return res.status(400).json({ message: 'Title, semester, enrolled, and capacity fields are required.' });
  }

  try {
    const newCourse = new Course({
      title: title.trim(),
      semester,
      enrolled,
      capacity,
      isOversize: isOversize || false,
      oversizeStudentCount: oversizeStudentCount || 0,
      isOverload: isOverload || false,
      overloadType: isOverload ? overloadType : undefined,
      paymentStatus: paymentStatus || 'Pending',
      lecturer: req.user.id,
    });

    await newCourse.save();

    logger.info(`Course created: ${newCourse.title} by ${req.user.email}`);
    res.status(201).json({ message: 'Course created successfully.', course: newCourse });
  } catch (error) {
    logger.error(`Error creating course: ${error.message}`);
    res.status(500).json({ message: 'Server error during course creation.' });
  }
};

/**
 * Edit a course (partial updates supported)
 * @route PUT /api/courses/:id
 * @access Private (User, QA)
 *
 * Lecturers can update all fields except paymentStatus.
 * QA can update paymentStatus as well.
 */
exports.editCourse = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Authorization: Only lecturer who created the course or QA can edit
    if (course.lecturer.toString() !== req.user.id && req.user.role !== 'QA') {
      return res.status(403).json({ message: 'Access denied. You can only edit your own courses.' });
    }

    // Update fields if provided
    if (updatedData.title !== undefined) course.title = updatedData.title.trim();
    if (updatedData.semester !== undefined) course.semester = updatedData.semester;
    if (updatedData.capacity !== undefined) course.capacity = updatedData.capacity;
    if (updatedData.enrolled !== undefined) course.enrolled = updatedData.enrolled;
    if (updatedData.isOversize !== undefined) course.isOversize = updatedData.isOversize;
    if (updatedData.oversizeStudentCount !== undefined) course.oversizeStudentCount = updatedData.oversizeStudentCount;
    if (updatedData.isOverload !== undefined) {
      course.isOverload = updatedData.isOverload;
      if (!updatedData.isOverload) {
        course.overloadType = undefined;
      }
    }
    if (updatedData.isOverload && updatedData.overloadType) {
      course.overloadType = updatedData.overloadType;
    }

    // Only QA can update paymentStatus
    if (updatedData.paymentStatus && req.user.role === 'QA') {
      course.paymentStatus = updatedData.paymentStatus;
    }
    // If a lecturer (User) tries to update paymentStatus, we silently ignore it

    await course.save();

    const updatedCourse = await Course.findById(id).populate('lecturer', 'name school');

    logger.info(`Course updated: ${updatedCourse.title} by ${req.user.email}`);
    res.status(200).json({ message: 'Course updated successfully.', course: updatedCourse });
  } catch (error) {
    logger.error(`Error updating course: ${error.message}`);
    res.status(500).json({ message: 'Server error during course update.' });
  }
};

/**
 * Approve a course
 * @route PATCH /api/courses/:id/approve
 * @access Private (QA)
 */
exports.approveCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (req.user.role !== 'QA') {
      return res.status(403).json({ message: 'Access denied. Only QA can approve courses.' });
    }

    const newStatus = course.paymentStatus === 'Approved' ? 'Pending' : 'Approved';
    course.paymentStatus = newStatus;
    await course.save();

    logger.info(`Course approved: ${course.title} by QA ${req.user.email}`);
    res.status(200).json({ message: `Course status updated to ${newStatus}.`, course });
  } catch (error) {
    logger.error(`Error approving course: ${error.message}`);
    res.status(500).json({ message: 'Server error during course approval.' });
  }
};

/**
 * Get a single course
 * @route GET /api/courses/:id
 * @access Private (User, QA)
 */
exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id).populate('lecturer', 'name school');

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.status(200).json({ course });
  } catch (error) {
    logger.error(`Error fetching course: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching course.' });
  }
};
