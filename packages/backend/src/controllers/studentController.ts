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

//Get Completed Quizzes
export const getCompletedQuizzes = async (req: Request, res: Response) => {
  try {
    const completedQuizzes = await Quiz.find({ dueDate: { $lt: new Date() } });
    res.status(200).json(completedQuizzes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch completed quizzes",
      error: error,
    });
  }
};

// Attempt a quiz
export const attemptQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const { answers, userId } = req.body; // answers should be an object like { questionId: answer }

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if student has already attempted this quiz
    const student = await User.findById(userId);
    if (
      quiz.attempts.some(
        (attempt) => attempt.student.toString() === userId.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "You have already attempted this quiz" });
    }

    // Check answers and calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.type === "radio" && answers[index] === question.answer) {
        score++;
      } else if (
        question.type === "ms" &&
        JSON.stringify(answers[index]) === JSON.stringify(question.answer)
      ) {
        score++;
      }
    });

    // Record the student's attempt
    quiz.attempts.push({ student: userId, score, answers });
    await quiz.save();

    res.status(200).json({ message: "Quiz attempted successfully", score });
  } catch (error) {
    res.status(500).json({ message: "Failed to attempt quiz", error: error });
  }
};

// Get student's results for a quiz (after due date)
export const getStudentResults = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { userId } = req.body;

  try {
    const quiz = await Quiz.findById(quizId).populate("attempts.student");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const studentAttempt = quiz.attempts.find(
      (attempt) => attempt.student.toString() === userId.toString()
    );

    if (!studentAttempt) {
      return res
        .status(404)
        .json({ message: "You have not attempted this quiz" });
    }

    res.status(200).json(studentAttempt);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error });
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
    res
      .status(500)
      .json({ message: "Failed to change password", error: error });
  }
};
