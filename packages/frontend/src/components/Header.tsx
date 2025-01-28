import React, { useEffect, useMemo } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    const userFromStorage = localStorage.getItem("user");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  }, []);

  useEffect(() => {
    if (token && user) {
      switch (user?.role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Student":
          navigate("/student");
          break;
        default:
          navigate("/");
          break;
      }
    } else {
      navigate("/");
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar position="absolute" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          School Management System
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
