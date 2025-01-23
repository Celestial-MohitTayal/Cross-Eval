import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Protect routes with JWT authentication
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // console.log(decoded)
    // req.user = decoded; // Attach user information to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
