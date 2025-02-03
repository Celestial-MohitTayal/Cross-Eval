import React, { useEffect, useMemo, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { set } from "react-hook-form";

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    const userFromStorage = localStorage.getItem("user");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  }, []);

  useEffect(() => {
    if (token && user) {
      setLoading(true);
    }
  },[token, user])

  useEffect(() => {
    if(loading){
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
      navigate("/")
    }
  }, [loading, navigate]);
  

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar position="absolute" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {user ? `${(user.role).toUpperCase()} DASHBOARD` : `EDUCATION MANAGEMENT SYSTEM` } 
        </Typography>
        {token && <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
