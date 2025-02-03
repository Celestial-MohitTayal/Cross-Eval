import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { post } from "../utils/httpHelper";
import Header from "../components/Header";

const ChangePass: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?._id;

  const apiUrl = import.meta.env.VITE_API_URL;

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle login form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    const isValid = validatePassword(newPassword);

    if (!isValid || newPassword == "") {
       setError(
        "Password must be 8 char, with atleast one number, one letter and one special character"
      );
      return setTimeout(() => setError(""), 5000);
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return setTimeout(() => setError(""), 5000);
    }

    try {
      const response = await post(
        apiUrl + "/student/change-password",
        {
          userId,
          newPassword,
        },
        token!
      );

      const user = response.user;

      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
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
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      } else {
        setError("An unexpected error occurred.");
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{ height: "100vh" }}
      >
        {/* Heading */}
        <Typography variant="h6" marginBottom={5} gutterBottom color="error">
          You need to change your password before proceeding to the dashboard.
        </Typography>

        {/* Paper with Change Password Form */}
        <Paper
          elevation={3}
          style={{
            padding: 20,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Change Password Form */}
          <Typography variant="h5" gutterBottom align="center">
            Change Password
          </Typography>
          <form onSubmit={ChangePass}>
            <Box mb={2}>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Box>
            {error && (
              <Typography
                variant="body2"
                sx={{ color: "red", marginBottom: 2 }}
              >
                {error}
              </Typography>
            )}
            {/* Buttons - Submit & Logout */}
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
};

export default ChangePass;
