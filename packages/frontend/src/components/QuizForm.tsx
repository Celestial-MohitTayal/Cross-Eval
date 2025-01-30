import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { post } from "../utils/httpHelper";

interface QuizComponentProps {
  fetchQuizzes: () => Promise<void>;
}

const QuizForm: React.FC<QuizComponentProps> = ({ fetchQuizzes }) => {
  const [title, setQuizTitle] = useState<string>("");
  const [subject, setQuizSubject] = useState<string>("");
  const [questions, setQuizQuestions] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setQuizQuestions(jsonData);
          alert("File successfully parsed!");
        } catch (error) {
          alert("Invalid JSON file. Please upload a valid file.");
        }
      };

      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !subject || !questions) {
      setError("All fields are required");
      setTimeout(() => setError(null), 5000);
      return;
    }
    const selectedDate = new Date(dueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to prevent time-related issues

    if (selectedDate < currentDate) {
      setError("Due date cannot be in the past");
      setTimeout(() => setError(null), 5000);
      return;
    }
    try {
      const response = await post(
        `${apiUrl}/quizzes/create-quiz`,
        { title, subject, questions, dueDate },
        token!
      );
      setSuccess(response.message);
      setQuizTitle("");
      setQuizSubject("");
      setDueDate("");
      setQuizQuestions(null);
      setTimeout(() => setSuccess(null), 3000);
      fetchQuizzes();
    } catch (err: any) {
      setError(err?.message || "Error creating quiz");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <Box margin={4}>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      {success && (
        <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Quiz Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                label="Subject"
                value={subject}
                onChange={(e) => setQuizSubject(e.target.value)}
              >
                <MenuItem value="Math">Math</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="English">English</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Due Date"
              type="date"
              variant="outlined"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Questions (JSON)
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Create Quiz
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default QuizForm;
