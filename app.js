// src/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const courseRoutes = require('./src/routes/courses');
const notificationRoutes = require('./src/routes/notifications');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger')(path.basename(__filename));
const seedQAAdmin = require('./src/seed/qaAdmin');

dotenv.config();

// Function to initialize the server
const initializeServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Run the seeder only in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      await seedQAAdmin();
    }
  } catch (error) {
    logger.error(`Initialization Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }

  const app = express();

  // Temporarily allow all origins and all methods for testing
  const corsOptions = {
    origin: true, // allows any origin for testing
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and authorization headers
  };

  // Apply CORS middleware
  app.use(cors(corsOptions));

  // Handle preflight requests for all routes
  app.options('*', cors(corsOptions));

  // Log when receiving OPTIONS requests for debugging
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      console.log(`OPTIONS request to ${req.originalUrl}`);
    }
    next();
  });

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Define Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Debugging: Log each middleware and route
  console.log('Routes Imported:');
  console.log('authRoutes:', authRoutes);
  console.log('adminRoutes:', adminRoutes);
  console.log('courseRoutes:', courseRoutes);
  console.log('notificationRoutes:', notificationRoutes);
  console.log('notFound:', notFound);
  console.log('errorHandler:', errorHandler);

  // Not Found Middleware
  app.use(notFound);

  // Error Handler Middleware
  app.use(errorHandler);

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  // Handle Unhandled Rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
  });

  // Start the server
  const PORT = process.env.PORT || 12000;
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

// Initialize the server
initializeServer();
