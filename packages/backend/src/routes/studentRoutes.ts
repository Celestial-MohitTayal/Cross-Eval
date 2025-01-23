import express from "express";
import { RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";
import { attemptQuiz, getAvailableQuizzes, changePassword } from "../controllers/studentController";

const router = express.Router();

// Student-specific routes
router.get("/quizzes", protect as RequestHandler, getAvailableQuizzes); // Get available quizzes
router.post("/attempt/:quizId", protect as RequestHandler, attemptQuiz as RequestHandler); // Attempt a quiz
router.post("/change-password", protect as RequestHandler, changePassword as RequestHandler); // Change student password

export default router;
