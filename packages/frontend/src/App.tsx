import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./redux/authSlice";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import QuizAttempt from "./components/QuizAttempt";
import ChangePass from "./pages/ChangePass";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null;

    if (token && user) {
      dispatch(login({ user, token }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />
        {/* Public routes for Admin, Teacher, and Student */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/quiz/:quizId/attempt" element={<QuizAttempt />} />
        <Route path="/changePass" element={<ChangePass />} />
      </Routes>
    </Router>
  );
};

export default App;
