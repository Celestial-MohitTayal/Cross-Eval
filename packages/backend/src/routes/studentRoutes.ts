import express from "express";
import { RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  attemptQuiz,
  getAvailableQuizzes,
  changePassword,
  getStudentResults,
} from "../controllers/studentController";

const router = express.Router();

// Student-specific routes
router.get("/get-avl-quizzes", protect as RequestHandler, getAvailableQuizzes); // Get available quizzes
router.post(
  "/attempt-quiz/:quizId",
  protect as RequestHandler,
  attemptQuiz as RequestHandler
); // Attempt a quiz
router.get(
  "/get-result",
  protect as RequestHandler,
  getStudentResults as RequestHandler
); // Get student result
router.post(
  "/change-password",
  protect as RequestHandler,
  changePassword as RequestHandler
); // Change student password

export default router;
