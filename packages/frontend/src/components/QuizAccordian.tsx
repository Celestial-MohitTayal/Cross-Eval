import React, { useState, useEffect } from "react";
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
import { get } from "../utils/httpHelper";
import { useNavigate } from "react-router-dom";

interface QuizAccordionProps {
  quizzes: Quiz[];
  userRole: string; // Either 'Teacher' or 'Student'
  userId?: string;
}

const QuizAccordion: React.FC<QuizAccordionProps> = ({
  quizzes,
  userRole,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const [quizResults, setQuizResults] = useState<any>({});

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "Teacher") {
      fetchQuizResults();
    }
  }, [userRole]);

  const fetchQuizResults = async () => {
    setLoading(true);
    try {
      const response = await get(`${apiUrl}/teacher/get-all-student`, token!);
      setQuizResults(response);
    } catch (error) {
      console.error("Error fetching quiz results", error);
    } finally {
      setLoading(false);
    }
  };

  const isDueDatePassed = (dueDate: string) => new Date(dueDate) <= new Date();

  const handleAttemptQuiz = (quizId: string) => {
    console.log("Attempting quiz with ID:", quizId, userId);
    navigate(`/quiz/${quizId}/attempt?userId=${userId}`);
  };

  const handleCheckResults = (quizId: string) => {
    console.log("Viewing results for quiz with ID:", quizId);
  };

  const handleEditQuiz = (quizId: string) => {
    console.log("Editing quiz with ID:", quizId);
  };

  const handleDeleteQuiz = (quizId: string) => {
    console.log("Deleting quiz with ID:", quizId);
  };

  return (
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
                        {isDueDatePassed(quiz.dueDate) ? (
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
    </Box>
  );
};

export default QuizAccordion;
