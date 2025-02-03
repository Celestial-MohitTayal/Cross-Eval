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

<!-- 
## Live Demo
-  -->

## Table of Contents
1. [Features](#features)  
2. [Installation](#installation)  
3. [Usage](#usage)  
4. [Folder Structure](#folder-structure)  
5. [Environment Variables](#environment-variables)  
6. [API Endpoints](#api-endpoints)  
7. [Technologies Used](#technologies-used)  
8. [Contributing](#contributing)  
9. [License](#license)  

## Installation

### Prerequisites  
- Node.js installed (`node -v`)  
- MongoDB (local or MongoDB Atlas)  
- npm or yarn installed  

### Steps to Run Locally

1. **Clone the repository**
```sh
git clone https://github.com/Celestial-MohitTayal/Cross-Eval.git
cd cross-eval
Install dependencies
Backend:
cd packages/backend
npm install
Frontend:
cd ../frontend
npm install
Set up environment variables
Create .env files for both the backend and frontend.

Backend:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Frontend:
VITE_API_URL=http://localhost:5000
Start the project
cd cross-eval:
npm start

Usage
Admin (SuperAdmin):
Login to access the organization page.
Create, edit, and delete teachers.
Grant/revoke access for teachers and students.

Teacher:
Onboard students with a validated form.
Create quizzes and set quiz deadlines.
Track student quiz attempts and scores.

Student:
View and attempt quizzes.
Timer will automatically submit answers after the time expires.

Backend (.env):
PORT: Port number for the server (default 5000).
MONGO_URI: MongoDB connection string.
JWT_SECRET: Secret key for JWT authentication.

Frontend (.env):
VITE_API_URL: Base URL for API calls (e.g., http://localhost:5000).

API Endpoints
POST /api/auth/login: Login a user (Admin, Teacher, or Student).
GET /api/teachers: Get a list of teachers (Admin only).
POST /api/quizzes: Create a quiz (Teacher only).
GET /api/quizzes/:id: Get quiz details (Teacher, Admin).
POST /api/attemptQuiz: Submit answers for a quiz (Student).

Technologies Used
Frontend:
React.js
Redux Toolkit
Material UI
TypeScript
Backend:
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
bcrypt.js
TypeScript
Contributing

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add feature').
Push to your branch (git push origin feature/your-feature).
Create a new Pull Request.