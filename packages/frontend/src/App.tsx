import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { login } from "./redux/authSlice";

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

        {/* Protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
          <Route path="/teacher" element={<TeacherPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route path="/student" element={<StudentPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
