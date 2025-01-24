import User, { IUser } from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

// Onboard a student
export const onboardStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, gender, dob } = req.body;

    console.log("Request Body:", req.body);

    const dobDate = new Date(dob);

    // Generate a default password based on the first four letters of the name + birth year
    const password = name.slice(0, 4).toLowerCase() + dobDate.getFullYear();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID
    const lastStudent = await User.findOne({ type: "Student" }).sort({
      userId: -1,
    });
    const userId = lastStudent
      ? `S${parseInt(lastStudent.userId.slice(1)) + 1}`
      : "S001";

    const student: IUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      role: "Student",
      userId,
    });

    await student.save();

    res
      .status(201)
      .json({ message: "Student onboarded successfully", student });
  } catch (error) {
    res.status(500).json({
      message: "Failed to onboard student",
      error: error,
    });
  }
};

// Get all students (for a teacher to view)
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await User.find({ role: "Student" });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error,
    });
  }
};
