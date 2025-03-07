import React, { useState, useEffect } from "react";
import ResultModal from "./ResultModal";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Quiz } from "../types/Quiz";
import { get, del } from "../utils/httpHelper";
import { useNavigate } from "react-router-dom";
import EditQuizModal from "./EditQuizModal";

interface QuizAccordionProps {
  quizzes: Quiz[];
  userRole: string; // Either 'Teacher' or 'Student'
  userId?: string;
  fetchQuizzes?: () => Promise<void>;
  setSuccess: (value: string | null) => void;
  setError: (value: string | null) => void;
}

const QuizAccordion: React.FC<QuizAccordionProps> = ({
  quizzes,
  userRole,
  userId,
  fetchQuizzes,
  setError,
  setSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [quizResults, setQuizResults] = useState<any>();
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState("");

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const isDueDatePassed = (dueDate: string) => new Date(dueDate) <= new Date();
  const hasStudentAttempted = (
    attempts: { student: string }[],
    userId?: string
  ) => attempts.some((attempt) => attempt.student === userId);

  const handleAttemptQuiz = (quizId: string) => {
    navigate(`/quiz-attempt/${quizId}`);
  };

  const handleCheckResults = async (quizId: string) => {
    try{if (userRole === "Student") {
      const data = await get(
        `${apiUrl}/student/get-result/${quizId}/${userId}`,
        token!
      );
      if (data.message) return alert(data.message);
      setQuizResults(data);
      setOpen(true);
    } else {
      const data = await get(`${apiUrl}/teacher/get-result/${quizId}`, token!);
      setQuizResults(data);
      setOpen(true);}
    } catch(error: any) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setQuizResults(null);
  };

  const handleEditQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setEditModalOpen(true);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await del(
        `${apiUrl}/teacher/delete-quiz/${quizId}`,
        token!
      );
      if (fetchQuizzes) {
        fetchQuizzes();
      }
      setSuccess(response.message);
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      setError("Error deleting user");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <>
      <Box>
        {loading ? (
          <CircularProgress />
        ) : (
          quizzes.map((quiz: Quiz) => (
            <Accordion key={quiz._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{quiz.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Subject: {quiz.subject}
                    </Typography>
                    <Typography variant="subtitle2">
                      Due Date: {new Date(quiz.dueDate).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={2} // Adds spacing between buttons
                    >
                      {userRole === "Student" && (
                        <>
                          {isDueDatePassed(quiz.dueDate) ||
                          hasStudentAttempted(quiz.attempts, userId) ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleCheckResults(quiz._id)}
                            >
                              Check Results
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleAttemptQuiz(quiz._id)}
                            >
                              Attempt Quiz
                            </Button>
                          )}
                        </>
                      )}

                      {userRole === "Teacher" && (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleEditQuiz(quiz._id)}
                          >
                            Edit Quiz
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteQuiz(quiz._id)}
                          >
                            Delete Quiz
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCheckResults(quiz._id)}
                          >
                            Check Results
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))
        )}
        {/* Render Modal */}
        {quizResults && (
          <ResultModal
            open={open}
            onClose={handleClose}
            attempts={quizResults}
          />
        )}
      </Box>
      <EditQuizModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        quizId={selectedQuizId}
        fetchQuizzes={fetchQuizzes}
        setError={setError}
        setSuccess={setSuccess}
      />
    </>
  );
};

export default QuizAccordion;
