import express from "express";
import { RequestHandler } from "express";
import { createAdmin } from "../controllers/createAdminController";


const router = express.Router();

// Admin-specific routes
router.post("/", createAdmin as RequestHandler);
export default router;
