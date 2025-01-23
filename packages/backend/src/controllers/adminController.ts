import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { hash } from "crypto";

// Create a teacher
export const createTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password, gender, dob } = req.body;

      console.log("Request Body:", req.body);


      if (!name || !email || !password || !gender || !dob) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Generate unique ID
      const lastTeacher = await User.findOne({ type: "Teacher" }).sort({ userId: -1 });
      const userId = lastTeacher ? `T${parseInt(lastTeacher.userId.slice(1)) + 1}` : "T001";
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
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
  
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.isActive = !user.isActive;
      await user.save();
  
      res.status(200).json({ message: "User access updated successfully", user });
    } catch (error) {
      next(error);
    }
  };

  // Get all students (for a teacher to view)
  export const getAllTeachers = async (req: Request, res: Response) => {
    try {
      const teachers = await User.find({ role: "Teacher" });
      res.status(200).json(teachers);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Failed to fetch students",
          error: error,
        });
    }
  };
  