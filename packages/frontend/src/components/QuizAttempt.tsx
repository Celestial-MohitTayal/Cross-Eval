import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../utils/httpHelper";
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Button,
  Box,
  Grid,
  LinearProgress,
} from "@mui/material";
import { useSelector } from "react-redux";

interface Question {
  _id: string;
  question: string;
  options: string[];
  type: "radio" | "ms";
  answer: string | string[];
}

interface Quiz {
  _id: string;
  title: string;
  subject: string;
  questions: Question[];
  dueDate: string;
}

const QuizAttempt: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const user = useSelector((state:any) => state?.auth?.user)
  const userId = user.userId;

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch Quiz Data
    const fetchQuiz = async () => {
      try {
        const data = await get(`${apiUrl}/quizzes/get-all-quiz`, token!);
        const selectedQuiz = data.find((quiz: Quiz) => quiz._id === quizId);
        if (selectedQuiz) {
          setQuiz(selectedQuiz);
          setTimeLeft(selectedQuiz.questions.length * 30);
        } else {
          setError("Quiz not found.");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching quizzes");
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); 
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionIndex: number, selected: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: selected }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await post(
        `${apiUrl}/student/attempt-quiz/${quizId}`,
        {
          userId,
          answers,
        },
        token!
      );
      navigate("/student");
    } catch (error: any) {
      setError(error);
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) return <Typography variant="h6">Loading quiz...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;
  if (!quiz) return <Typography variant="h6">Quiz not found.</Typography>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ width: 600, p: 3, boxShadow: 3 }}>
        <CardContent>
          {/* Quiz Title & Timer */}
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            {quiz.title} - {quiz.subject}
          </Typography>
          <LinearProgress variant="determinate" value={(timeLeft / (quiz.questions.length * 30)) * 100} sx={{ mb: 2 }} />
          <Typography variant="subtitle1" color="error">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")} mins
          </Typography>

          {/* Question Section */}
          <Typography variant="h6" mt={2}>
            Q{currentQuestionIndex + 1}: {currentQuestion.question}
          </Typography>

          {/* Answer Options */}
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Select your answer</FormLabel>
            {currentQuestion.type === "radio" ? (
              <RadioGroup
                name={`question-${currentQuestionIndex}`}
                value={answers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
              >
                {currentQuestion.options.map((option, i) => (
                  <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            ) : (
              currentQuestion.options.map((option, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={Array.isArray(answers[currentQuestionIndex]) && answers[currentQuestionIndex].includes(option)}
                      onChange={(e) => {
                        const selectedOptions = Array.isArray(answers[currentQuestionIndex])
                          ? [...answers[currentQuestionIndex]]
                          : [];
                        if (e.target.checked) {
                          selectedOptions.push(option);
                        } else {
                          selectedOptions.splice(selectedOptions.indexOf(option), 1);
                        }
                        handleAnswerChange(currentQuestionIndex, selectedOptions);
                      }}
                    />
                  }
                  label={option}
                />
              ))
            )}
          </FormControl>

          {/* Navigation Buttons */}
          <Grid container spacing={2} mt={3}>
            <Grid item xs={6}>
              <Button variant="contained" color="secondary" fullWidth disabled={currentQuestionIndex === 0} onClick={handlePrevious}>
                Previous
              </Button>
            </Grid>
            <Grid item xs={6}>
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button variant="contained" color="primary" fullWidth onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuizAttempt;
