import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const LoginPage: React.FC = () => {
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
      const response = await axios.post(apiUrl + "/login", {
        email,
        password,
      });

      let user = response.data.user;
      // On success, save the JWT token to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      if(!user.passChanged){
        return navigate("/changePass")
      }

      // Authentication logic
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
          alert("Invalid credentials");
          break;
      }
    } catch (err: any) {
      // Handle errors (e.g., invalid credentials or server error)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        setTimeout(() => setError(""), 5000);
      } else {
        setError("An unexpected error occurred.");
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Paper
        elevation={3}
        style={{ padding: 20, maxWidth: 400, width: "100%" }}
      >
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
          {error && (
            <Typography variant="body2" sx={{ color: "red", marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
