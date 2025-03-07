import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Grid, TextField, Button } from "@mui/material";
import Header from "../components/Header";
import QuizAccordion from "../components/QuizAccordian";
import { get } from "../utils/httpHelper";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const StudentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Available Quiz, 1 for Completed Quiz
  const [avlQuizzes, setAvlQuizzes] = useState<any[]>([]);
  const [cmpQuizzes, setCmpQuizzes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const userId = useSelector((state: RootState) => state?.auth?.user?.userId);

  // Fetch available quiz when the component mounts
  useEffect(() => {
    fetchAvailableQuizzes();
  }, []);

  // Fetch completed quiz when switching to the 2nd tab
  useEffect(() => {
    if (activeTab === 1) {
      fetchCompletedQuizzes();
    }
  }, [activeTab]);

  const fetchAvailableQuizzes = async () => {
    try {
      const data = await get(
        `${apiUrl}/student/get-avl-quizzes/${userId}`,
        token!
      );
      setAvlQuizzes(data);
    } catch (err) {
      setError("Error fetching available quizzes");
      setTimeout(() => setError(null), 5000);
    }
  };

  const fetchCompletedQuizzes = async () => {
    try {
      const data = await get(
        `${apiUrl}/student/get-cmp-quizzes/${userId}`,
        token!
      );
      setCmpQuizzes(data);
    } catch (err) {
      setError("Error fetching completed quizzes");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div style={{ padding: "20px", paddingTop: "60px" }}>
      <Header />
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        aria-label="User Management Tabs"
      >
        <Tab label="Available Quizzes" />
        <Tab label="Completed Quizzes" />
      </Tabs>

      {error && (
        <div style={{ color: "red", margin: "10px", textAlign: "center" }}>{error}</div>
      )}
      {success && (
        <div style={{ color: "green", margin: "10px", textAlign: "center" }}>{success}</div>
      )}

      <Box>
        {activeTab === 0 ? (
          <>
            <Box margin={4}>
              <h2>Available Quizzes : {avlQuizzes.length}</h2>
              {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                  {error}
                </div>
              )}
              <QuizAccordion
                quizzes={avlQuizzes}
                userRole={"Student"}
                userId={userId}
                setError={setError}
                setSuccess={setSuccess}
              />
            </Box>
          </>
        ) : (
          <>
            <Box margin={4}>
              <h2>Completed Quizzes : {cmpQuizzes.length}</h2>
              <QuizAccordion
                quizzes={cmpQuizzes}
                userRole={"Student"}
                userId={userId}
                setError={setError}
                setSuccess={setSuccess}
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default StudentPage;
