export interface Quiz {
    id: string;
    title: string;
    subject: string;
    dueDate: string; // Format: YYYY-MM-DD
    questions: Question[];
  }
  
  export interface Question {
    ques: string;
    options: string[];
    type: "radio" | "ms"; // Single or multi-select
    answer: string[] | string;
  }
  