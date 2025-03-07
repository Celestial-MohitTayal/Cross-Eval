import express from "express";
import { RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  attemptQuiz,
  getAvailableQuizzes,
  changePassword,
  getStudentResults,
  getCompletedQuizzes,
} from "../controllers/studentController";

const router = express.Router();

// Student-specific routes
router.get(
  "/get-avl-quizzes/:userId",
  protect as RequestHandler,
  getAvailableQuizzes as RequestHandler
); // Get available quizzes
router.get(
  "/get-cmp-quizzes/:userId",
  protect as RequestHandler,
  getCompletedQuizzes as RequestHandler
); // Get completed quizzes
router.post(
  "/attempt-quiz/:quizId",
  protect as RequestHandler,
  attemptQuiz as RequestHandler
); // Attempt a quiz
router.get(
  "/get-result/:quizId/:userId",
  protect as RequestHandler,
  getStudentResults as RequestHandler
); // Get student result
router.post(
  "/change-password",
  protect as RequestHandler,
  changePassword as RequestHandler
); // Change student password

export default router;
