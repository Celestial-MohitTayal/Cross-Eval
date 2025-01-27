import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import axios from "axios";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_URL;
 
  // Handle login form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const response = await axios.post(apiUrl+"/login", {
        email,
        password,
      });

      let user = response.data.user;
      // On success, save the JWT token to localStorage or sessionStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Authentication logic - use switch case, constants
    if (user.role === "Admin") {
      dispatch(login({ id: user.userId, name: user.name, email, type: user.role, isLoggedIn: true }));
      navigate("/admin");
    } else if (user.role === "Teacher") {
      dispatch(login({ id: user.userId, name: user.name, email, type: user.role, isLoggedIn: true }));
      navigate("/teacher");
    } else if (user.role === "Student") {
      dispatch(login({ id: user.userId, name: user.name, email, type: user.role, isLoggedIn: true }));
      navigate("/student");
    } else {
      alert("Invalid credentials");
    }

    } catch (err: any) {
      // Handle errors (e.g., invalid credentials or server error)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
      <Paper elevation={3} style={{ padding: 20, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
