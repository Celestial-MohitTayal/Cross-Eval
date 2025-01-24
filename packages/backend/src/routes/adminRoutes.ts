import express from "express";
import { RequestHandler } from "express";
import {
  createTeacher,
  deleteUser,
  toggleUserAccess,
  getAllTeachers,
} from "../controllers/adminController";

const router = express.Router();

// Admin-specific routes
router.get("/teachers/all", getAllTeachers); // Get All Teachers
router.post("/teachers", createTeacher as RequestHandler); // Create a teacher
router.delete("/users/:id", deleteUser as RequestHandler); // Delete a user (teacher/student)
router.patch("/users/:id/toggle-access", toggleUserAccess as RequestHandler); // Grant/Revoke access

export default router;
