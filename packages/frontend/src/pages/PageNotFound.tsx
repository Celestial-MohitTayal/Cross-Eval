import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";

const PageNotFound = () => {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("/");
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    const userFromStorage = localStorage.getItem("user");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  }, []);

  useEffect(() => {
    if (token && user) {
      setLoading(true);
    }
  }, [token, user]);

  useEffect(() => {
    if (loading) {
      switch (user?.role) {
        case "Admin":
          setPath("/admin");
          break;
        case "Teacher":
          setPath("/teacher");
          break;
        case "Student":
          setPath("/student");
          break;
        default:
          setPath("/");
          break;
      }
    }
  }, [loading]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          textAlign: "center",
          borderRadius: "12px",
          maxWidth: 500,
        }}
      >
        <Typography variant="h1" color="error" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" mt={2}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" mt={1}>
          The page you are looking for doesn’t exist or has been moved.
        </Typography>

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} color="primary" />
        ) : (
          <Button
            component={Link as any}
            to={path}
            variant="contained"
            color="primary"
            sx={{ mt: 3, px: 3, py: 1.5, fontSize: "1rem", borderRadius: "8px" }}
          >
            Go Home
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default PageNotFound;
