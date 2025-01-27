import express from "express";
import { RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";
import { createQuiz, getQuizzes } from "../controllers/quizController";

const router = express.Router();

// Teacher-specific routes for managing quizzes
router.post("/create-quiz", protect as RequestHandler, createQuiz as RequestHandler); // Create a quiz
router.get("/get-all-quiz", protect as RequestHandler, getQuizzes); // Get all quizzes

export default router;
