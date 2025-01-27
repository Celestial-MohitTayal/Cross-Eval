export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional for responses
    gender: "male" | "female";
    type: "Admin" | "Teacher" | "Student";
    dob: string; // Format: YYYY-MM-DD
  }
  