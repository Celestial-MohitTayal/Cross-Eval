import { Request, Response } from "express";
import Quiz from "../models/Quiz";
import User from "../models/User";
import bcrypt from "bcryptjs";

// Get available quizzes for a student
export const getAvailableQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find({ dueDate: { $gte: new Date() } });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes", error: error });
  }
};

// Attempt a quiz
export const attemptQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // answers should be an object like { questionId: answer }

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Validate that the student has not already attempted the quiz
    // You can store the student's attempts in a separate collection if needed

    // Check answers and calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.type === "radio" && answers[index] === question.answer) {
        score++;
      } else if (question.type === "ms" && JSON.stringify(answers[index]) === JSON.stringify(question.answer)) {
        score++;
      }
    });

    res.status(200).json({ message: "Quiz attempted successfully", score });
  } catch (error) {
    res.status(500).json({ message: "Failed to attempt quiz", error: error });
  }
};

// Change student password (when they log in for the first time)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId, newPassword } = req.body;

    // Find the student
    const student = await User.findById(userId);
    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Hash the new password and save
    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error });
  }
};
