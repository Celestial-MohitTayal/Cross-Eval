import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  subject: string;
  questions: {
    question: string;
    options: string[];
    type: "radio" | "ms"; // Single choice or Multiple Select
    answer: string[] | string; // For multiple choices, answer is an array
  }[];
  attempts: {
    student: string;
    answers: string[] | string;
    score: number;
  }[];
  dueDate: Date;
}

const QuizSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        type: { type: String, enum: ["radio", "ms"], required: true },
        answer: { type: Schema.Types.Mixed, required: true },
      },
    ],
    attempts: [
      {
        student: { type: String, required: true },
        answers: { type: Schema.Types.Mixed, required: true },
        score: { type: Number, required: true },
      },
    ],
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
