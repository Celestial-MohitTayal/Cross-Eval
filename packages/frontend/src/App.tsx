import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import QuizAttempt from "./components/QuizAttempt";
import ChangePass from "./pages/ChangePass";
import PageNotFound from "./pages/PageNotFound";

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />
        {/* Public routes for Admin, Teacher, and Student */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/quiz-attempt/:quizId" element={<QuizAttempt />} />
        <Route path="/changePass" element={<ChangePass />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
