import { Request, Response } from "express";
import Quiz, { IQuiz } from "../models/Quiz";

// Create a new quiz
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, subject, questions, dueDate } = req.body;

    // Validate the number of questions
    if (questions.length > 50) {
      return res
        .status(400)
        .json({ message: "Quiz can have a maximum of 50 questions." });
    }

    const quiz: IQuiz = new Quiz({
      title,
      subject,
      questions,
      dueDate,
    });
    
    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create quiz",
      error: "Error creating quiz...",
    });
  }
};

// Get all quizzes (for a teacher to view)
export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch quizzes",
      error: error,
    });
  }
};


export const getQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId } = req.params;
  
  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching results", error);
    res.status(500).json({ message: "Error fetching results", error: error });
  }
};