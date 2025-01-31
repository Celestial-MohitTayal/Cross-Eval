import express from "express";
import { RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  onboardStudent,
  getAllStudents,
  getResults,
  deleteQuiz,
  updateQuiz
} from "../controllers/teacherController";

const router = express.Router();

// Teacher-specific routes for onboarding students
router.post("/onboard-student", protect as RequestHandler, onboardStudent); // Onboard a student
router.get("/get-all-student", protect as RequestHandler, getAllStudents); // Get all students
router.get("/get-result/:quizId", protect as RequestHandler,  getResults) // Get Students Result
router.delete("/delete-quiz/:quizId", protect as RequestHandler, deleteQuiz as RequestHandler); // Delete a quiz 
router.put("/update-quiz/:quizId",protect as RequestHandler, updateQuiz as RequestHandler);
export default router;
