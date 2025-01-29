export interface Quiz {
  _id: string;
  title: string;
  subject: string;
  dueDate: string; // Format: YYYY-MM-DD
  questions: Question[];
  attempts: Attempt[];
}

export interface Question {
  ques: string;
  options: string[];
  type: "radio" | "ms"; // Single or multi-select
  answer: string[] | string;
}

export interface Attempt {
  student: string;
  answers: string[] | string; 
  score: number; 
}
