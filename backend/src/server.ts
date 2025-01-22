import adminRoutes from "./routes/adminRoutes";
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

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

