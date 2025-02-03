# School Management System

## Description
A school management system built with the **MERN stack** (MongoDB, Express.js, React, Node.js) that allows admins, teachers, and students to manage user access, onboard teachers/students, create and attempt quizzes, and more.

### Key Features:
- **Admin (SuperAdmin)**:
  - Can create, edit, and delete teachers.
  - Can grant/revoke access to teachers and students.
  - Onboard teachers to the portal.
  - Manage organization hierarchy using charts.
  
- **Teacher**:
  - Can onboard students with a validated form.
  - Can create quizzes by uploading JSON files.
  - Track student quiz attempts and scores.
  
- **Student**:
  - Can attempt quizzes with a timer and auto-submission.
  - View results after the due date.

**Tech Stack**:
- **Frontend**: React.js, Redux Toolkit, Material UI, TypeScript
- **Backend**: Node.js, Express.js, JWT Authentication, bcrypt.js, TypeScript
- **Database**: MongoDB (via Mongoose)
