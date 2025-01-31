import express from "express";
import { RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createTeacher,
  deleteUser,
  toggleUserAccess,
  getAllTeachers,
  editUser,
  getUser,
} from "../controllers/adminController";

const router = express.Router();

// Admin-specific routes
router.get("/get-all-teachers", protect as RequestHandler, getAllTeachers); // Get All Teachers
router.post(
  "/create-teacher",
  protect as RequestHandler,
  createTeacher as RequestHandler
); // Create a teacher
router.delete(
  "/delete-users/:id",
  protect as RequestHandler,
  deleteUser as RequestHandler
); // Delete a user (teacher/student)
router.put(
  "/toggle-access/:id",
  protect as RequestHandler,
  toggleUserAccess as RequestHandler
); // Grant/Revoke access
router.put(
  "/edit-user/:id",
  protect as RequestHandler,
  editUser as RequestHandler
);
router.get(
  "/get-user/:id",
  protect as RequestHandler,
  getUser as RequestHandler
); // Get user

export default router;
