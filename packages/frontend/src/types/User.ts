export interface User {
    _id: string;
    name: string;
    email: string;
    gender: string;
    role: "Admin" | "Teacher" | "Student";
    isActive: boolean;
    dob: string; // Format: YYYY-MM-DD
  }
  