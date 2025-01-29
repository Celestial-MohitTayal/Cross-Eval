import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { get, post } from "../utils/httpHelper";

interface Question {
  _id: string;
  question: string;
  options: string[];
  type: "radio" | "ms";
  answer: string | string[]; // Correct answer (not used in frontend)
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
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {}
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch Quiz Data
    const fetchQuiz = async () => {
      try {
        const data = await get(`${apiUrl}/quizzes/get-all-quiz`, token!);
        const quiz = data.filter((quiz: any) => quiz._id == quizId);
        setQuiz(quiz[0]);
        setTimeLeft(quiz[0].questions.length * 30);
        setLoading(false);
      } catch (err) {
        setError("Error fetching quizzes");
        console.log("Error fetching quizzes");
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (
    questionIndex: number,
    selected: string | string[]
  ) => {
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
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2>
        {quiz?.title} - {quiz?.subject}
      </h2>
      <p>
        Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")} mins
      </p>

      <div className="question-section">
        <h3>
          Q{currentQuestionIndex + 1}: {currentQuestion.question}
        </h3>

        {currentQuestion.type === "radio"
          ? currentQuestion.options.map((option, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name={currentQuestion._id}
                  value={option}
                  checked={answers[currentQuestionIndex] === option}
                  onChange={() =>
                    handleAnswerChange(currentQuestionIndex, option)
                  }
                />
                {option}
              </label>
            ))
          : currentQuestion.options.map((option, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  value={option}
                  checked={
                    Array.isArray(answers[currentQuestionIndex]) &&
                    (answers[currentQuestionIndex] as string[]).includes(option)
                  }
                  onChange={(e) => {
                    const selectedOptions = Array.isArray(
                      answers[currentQuestionIndex]
                    )
                      ? [...(answers[currentQuestionIndex] as string[])]
                      : [];
                    if (e.target.checked) {
                      selectedOptions.push(option);
                    } else {
                      selectedOptions.splice(
                        selectedOptions.indexOf(option),
                        1
                      );
                    }
                    handleAnswerChange(currentQuestionIndex, selectedOptions);
                  }}
                />
                {option}
              </label>
            ))}
      </div>

      <div className="navigation-buttons">
        <button disabled={currentQuestionIndex === 0} onClick={handlePrevious}>
          Previous
        </button>
        {currentQuestionIndex < (quiz?.questions.length ?? 0) - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
