import express from "express";
import { RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  onboardStudent,
  getAllStudents,
} from "../controllers/teacherController";

const router = express.Router();

// Teacher-specific routes for onboarding students
router.post("/onboard-student", protect as RequestHandler, onboardStudent); // Onboard a student
router.get("/get-all-student", protect as RequestHandler, getAllStudents); // Get all students

export default router;
