import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Grid, TextField, Button } from "@mui/material";
import Header from "../components/Header";
import UserForm from "../components/userForm";
import UserTable from "../components/userTable";
import QuizAccordion from "../components/QuizAccordian";
import QuizForm from "../components/QuizForm";
import { get, post, put, del } from "../utils/httpHelper";

const TeacherPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Teachers, 1 for Students
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Fetch teachers when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students when switching to the "Students" tab
  useEffect(() => {
    if (activeTab === 1) {
      fetchQuizzes();
    }
  }, [activeTab]);

  const fetchQuizzes = async () => {
    try {
      const data = await get(`${apiUrl}/quizzes/get-all-quiz`, token!);
      setQuizzes(data);
    } catch (err) {
      setError("Error fetching quizzes");
      setTimeout(() => setError(null), 5000);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await get(`${apiUrl}/teacher/get-all-student`, token!);
      setStudents(data);
    } catch (err) {
      setError("Error fetching students");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCreateStudent = async (data: {
    name: string;
    email: string;
    gender: string;
    dob: string;
  }) => {
    // Validate that DOB is not in the future
    const selectedDate = new Date(data.dob);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize the current date

    if (selectedDate > currentDate) {
      setError("Date of Birth cannot be in the future");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      const response = await post(
        `${apiUrl}/teacher/onboard-student`,
        data,
        token!
      );
      fetchStudents();
      setSuccess(response.message);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err?.message || "Error creating teacher");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleToggleAccess = async (id: string, role: string) => {
    try {
      const response = await put(
        `${apiUrl}/admin/toggle-access/${id}`,
        {},
        token!
      );
      fetchStudents();
      setSuccess(response.message);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError("Error toggling access");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteUser = async (id: string, role: string) => {
    try {
      const response = await del(`${apiUrl}/admin/delete-users/${id}`, token!);
      fetchStudents();
      setSuccess(response.message);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError("Error deleting user");
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
        <Tab label="Students" />
        <Tab label="Quizzes" />
      </Tabs>

      {error && (
        <div style={{ color: "red", margin: "10px", textAlign: "center" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ color: "green", margin: "10px", textAlign: "center" }}>
          {success}
        </div>
      )}

      <Box>
        {activeTab === 0 ? (
          <>
            <Box margin={4}>
              <h2>Create Student</h2>
              <UserForm onSubmit={handleCreateStudent} />
            </Box>
            <Box margin={4}>
              <h2>Students List : {students.length} </h2>
              <p>
                Student password will be first 4 letter of student name +
                student birth year, Example: Name - Student 1, DOB: 2025-01-01
                than Password: stud2025
              </p>
              <UserTable
                users={students}
                onToggleAccess={handleToggleAccess}
                onDelete={handleDeleteUser}
                fetchUsers={fetchStudents}
                setError={setError}
                setSuccess={setSuccess}
              />
            </Box>
          </>
        ) : (
          <>
            <Box margin={4}>
              <h2>Create New Quiz</h2>
              <QuizForm fetchQuizzes={fetchQuizzes} />
            </Box>
            <Box margin={4}>
              <h2>Quizzes List: {quizzes.length}</h2>
              <QuizAccordion
                quizzes={quizzes}
                userRole={"Teacher"}
                fetchQuizzes={fetchQuizzes}
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

export default TeacherPage;
