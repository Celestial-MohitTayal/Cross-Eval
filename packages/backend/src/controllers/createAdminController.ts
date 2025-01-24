import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";

// Create a admin
export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { name, email, password, gender, dob, userId } = req.body;

    console.log("Request Body:", req.body);

    if (!name || !email || !password || !gender || !dob || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin: IUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      role: "Admin",
      userId,
    });

    await admin.save();

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    next(error);
  }
};