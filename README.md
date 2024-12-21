# HProject Backend

This is the backend for **course payment status**, a Node.js / Express application that manages user authentication, role assignment, course creation, and approval processes. It includes functionality for creating and approving courses, assigning QA roles, sending notifications, and more. The backend uses MongoDB via Mongoose for database operations and JWT for authentication.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
- [Available Scripts](#available-scripts)  
- [Project Structure](#project-structure)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)

---

## Features

- **User Registration & Login**  
  - Register with UTG email addresses only  
  - Secure password hashing (bcrypt)  
  - JWT-based authentication

- **Role Management**  
  - Default role: `User` (Lecturer)  
  - `QA` (Admin) users can create QA users, assign roles, and approve courses

- **Courses**  
  - Lecturers (`User` role) can create, read, and update their own courses (but not change `paymentStatus`)  
  - QA users can change `paymentStatus` (approve courses, mark pending, etc.)  
  - Overload, oversize course fields, and capacity management

- **Notifications**  
  - QA can send notifications to all `User` (lecturer) accounts via email

- **Logging**  
  - Winston-based logging for errors, warnings, and info messages

- **Error Handling**  
  - Centralized error handling and not-found middleware

---

## Tech Stack

- **Node.js** & **Express**: Server and routing  
- **MongoDB** & **Mongoose**: Database and ORM  
- **JWT**: Authentication  
- **Nodemailer**: Email sending  
- **Winston**: Logging  
- **bcryptjs**: Password hashing  

---

## Getting Started

### Prerequisites

- **Node.js** (v14+ recommended)  
- **npm** or **yarn**  
- **MongoDB** instance (local or remote)  

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/YourUsername/HProject.git
   cd HProject
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```

3. **Configure environment variables** (see [Environment Variables](#environment-variables)).

4. **Start the server**:

   ```bash
   npm run dev
   ```
   This starts the server in development mode on the port specified in `.env` (defaults to `12000`).

### Environment Variables

Create a `.env` file in the project root with the following (example) structure:

```bash
NODE_ENV=development
PORT=12000
MONGODB_URI=mongodb://localhost:27017/hproject

JWT_SECRET=some-secret-token
JWT_EXPIRE=1h

EMAIL_USER=your.email@domain.com
EMAIL_PASS=yourEmailPassword

# (Optional) for production logging levels, file paths, etc.
```

Adjust the variable values according to your environment.

---

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**  
  Launches the server in development mode with automatic reloading.

- **`npm start`**  
  Launches the server in production mode (no reloading).

---

## Project Structure

```
HProject/
├── src/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── mail.js        # Nodemailer transporter config
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   └── Course.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── courses.js
│   │   └── notifications.js
│   ├── seed/
│   │   └── qaAdmin.js     # Seeding QA admin account in non-production
│   ├── utils/
│   │   ├── logger.js
│   │   └── sendEmail.js
│   └── app.js
├── .env                    # Environment variables
├── package.json
└── README.md               # This file
```

- **`config/`**: Holds configuration files (database connection, email transporter).  
- **`controllers/`**: Holds logic for each feature (admin actions, auth, courses).  
- **`middleware/`**: Holds custom middleware for authentication, error handling, etc.  
- **`models/`**: Mongoose schema definitions (`User`, `Course`).  
- **`routes/`**: Express routes, organized by feature (admin, auth, etc.).  
- **`utils/`**: Utility functions like `logger` (winston) and `sendEmail`.  
- **`app.js`**: Initializes the Express application, sets up routes, and starts the server.  

---

## API Endpoints

Below is a high-level overview. For detailed request/response formats, see the controller files or your API testing tool (e.g., Postman):

### Auth
- **`POST /api/auth/register`**  
  - Registers a new lecturer user
- **`POST /api/auth/login`**  
  - Authenticates a user and returns a JWT

### Admin (QA)
- **`POST /api/admin/assign-role`**  
  - Assigns the `QA` role to an existing user
- **`POST /api/admin/create-qa`**  
  - Creates a new user with `QA` role
- **`POST /api/admin/send-notification`**  
  - Sends a notification (email) to all users
- **`GET /api/admin/users`**  
  - Retrieves all users (for QA)

### Courses
- **`GET /api/courses`**  
  - Retrieves all courses; access depends on user role
- **`POST /api/courses`**  
  - Creates a new course (lecturers or QA)
- **`PUT /api/courses/:id`**  
  - Edits an existing course  
- **`PATCH /api/courses/:id/approve`**  
  - Toggles a course’s `paymentStatus` (QA only)
- **`GET /api/courses/:id`**  
  - Retrieves a specific course by ID

### Notifications
- **`POST /api/notifications`**  
  - QA sends a notification to all lecturers

---

## Contributing

1. **Fork** this repository.  
2. Create a new **branch** for your changes.  
3. **Commit** your changes and **push** to your fork.  
4. Submit a **pull request** detailing your changes.

---

## License

This project is open-source. You can adapt and use it in accordance with the license terms specified in the repository. 

If you have any questions or suggestions, feel free to open an issue or pull request! 

Happy coding!