import express from "express";
import { RequestHandler } from "express";
import { login } from "../controllers/authController";

const router = express.Router();

router.post("/", login as RequestHandler); // Login route

export default router;
