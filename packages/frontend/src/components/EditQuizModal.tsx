import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { put, get } from "../utils/httpHelper";

interface EditQuizModalProps {
  open: boolean;
  onClose: () => void;
  quizId: string | null;
  fetchQuizzes?: () => Promise<void>;
  setSuccess: (value: string | null) => void;
  setError: (value: string | null) => void;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({
  open,
  onClose,
  quizId,
  fetchQuizzes,
  setError,
  setSuccess
}) => {
  const [quizData, setQuizData] = useState({
    title: "",
    subject: "",
    dueDate: "",
  });
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (quizId) {
      get(`${apiUrl}/quizzes/get-quiz/${quizId}`, token!)
        .then((data) =>
          setQuizData({
            title: data.title,
            subject: data.subject,
            dueDate: data.dueDate.split("T")[0],
          })
        )
        .catch((err) => console.error("Error fetching quiz:", err));
    }
  }, [quizId]);

  const handleChange = (e: any) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await put(`${apiUrl}/teacher/update-quiz/${quizId}`, quizData, token!);
      if (fetchQuizzes) {
        fetchQuizzes();
      }
      setSuccess("Quiz updated successfully!");
      setTimeout(() => setSuccess(null), 5000);
      
      onClose();
    } catch (err) {
      setError("Error updating quiz");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          p: 3,
          bgcolor: "white",
          m: "auto",
          mt: 10,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Edit Quiz</Typography>
        <TextField
          label="Title"
          name="title"
          value={quizData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Subject"
          name="subject"
          value={quizData.subject}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Due Date"
          type="date"
          name="dueDate"
          value={quizData.dueDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditQuizModal;
