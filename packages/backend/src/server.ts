import studentRoutes from "./routes/studentRoutes"
import teacherRoutes from "./routes/teacherRoutes"
import adminRoutes from "./routes/adminRoutes";
import quizRoutes from "./routes/quizRoutes"
import authRoutes from "./routes/authRoutes"
import connectDB from './config/db';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/login", authRoutes)
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);  
app.use("/api/quizzes", quizRoutes);  
app.use("/api/student", studentRoutes);  


app.get("/", (req, res) => {
    res.send("Backend is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

