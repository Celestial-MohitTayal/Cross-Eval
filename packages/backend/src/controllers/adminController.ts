import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import mongoose from "mongoose";

// Create a teacher
export const createTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { name, email, gender, dob } = req.body;

    console.log("Request Body:", req.body);

    if (!name || !email || !gender || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const dobDate = new Date(dob);

    // Generate a default password based on the first four letters of the name + birth year
    const password = name.slice(0, 4).toLowerCase() + dobDate.getFullYear();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID
    const lastTeacher = await User.findOne({ role: "Teacher" }).sort({
      userId: -1,
    });

    const userId = lastTeacher
      ? `T${parseInt(lastTeacher.userId.slice(1)) + 1}`
      : "T1";

    const teacher: IUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      role: "Teacher",
      userId,
    });

    await teacher.save();

    res.status(201).json({ message: "Teacher created successfully", teacher });
  } catch (error) {
    next(error);
  }
};

// Delete a user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Toggle user access
export const toggleUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User access updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while toggling user access",
      error: error,
    });
    next(error);
  }
};

// Get all teachers (for a admin to view)
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await User.find({ role: "Teacher" });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error,
    });
  }
};
