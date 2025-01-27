import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import { Lock, LockOpen, Delete } from "@mui/icons-material";
import Header from "../components/Header";

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Teachers, 1 for Students
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch teachers when the component mounts
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch students when switching to the "Students" tab
  useEffect(() => {
    if (activeTab === 1) {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchTeachers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${apiUrl}/admin/get-all-teachers`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      setTeachers(response.data);
    } catch (err) {
      setError("Error fetching teachers");
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${apiUrl}/teacher/get-all-student`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      setStudents(response.data);
    } catch (err) {
      setError("Error fetching students");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value,
    });
  };

  const handleToggleAccess = async (id: string, role: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        `${apiUrl}/admin/users/${id}/toggle-access`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      alert(response.data.message);

      // Refresh the respective list based on the role
      if (role === "Teacher") {
        fetchTeachers();
      } else if (role === "Student") {
        fetchStudents();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating access");
    }
  };

  const handleDeleteUser = async (id: string, role: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${apiUrl}/admin/delete-users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      alert(response.data.message);

      // Refresh the respective list based on the role
      if (role === "Teacher") {
        fetchTeachers();
      } else if (role === "Student") {
        fetchStudents();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        apiUrl + "/admin/create-teacher",
        teacherData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      alert(response.data.message); // Show success message
      fetchTeachers(); // Refresh the teacher list
      setTeacherData({
        name: "",
        email: "",
        gender: "",
        dob: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating teacher");
    }
  };

  return (
    <div style={{ padding: "20px", paddingTop: "60px" }}>
      <Header />
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
      >
        <Tab label="Teachers" />
        <Tab label="Students" />
      </Tabs>

      {activeTab === 0 && (
        <div>
          <h2>Create Teacher</h2>
          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
          <form onSubmit={handleCreateTeacher}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={teacherData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={teacherData.email}
                  onChange={handleChange}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={teacherData.gender}
                    onChange={handleSelectChange}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date of Birth"
                  name="dob"
                  fullWidth
                  type="date"
                  value={teacherData.dob}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Create Teacher
                </Button>
              </Grid>
            </Grid>
          </form>
          <Box marginTop={10}>
            <h2>Teachers List : {teachers.length}</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Access</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher._id}>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.gender}</TableCell>
                      <TableCell>{teacher.dob.slice(0, 10)}</TableCell>
                      <TableCell>
                        {teacher.isActive ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleToggleAccess(teacher._id, "Teacher")
                          }
                        >
                          {teacher.isActive ? <LockOpen /> : <Lock />}
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteUser(teacher._id, "Teacher")
                          }
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      )}

      {activeTab === 1 && (
        <div>
          <h2>Students List: {students.length}</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Access</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.dob}</TableCell>
                    <TableCell>
                      {student.isActive ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleToggleAccess(student._id, "Student")
                        }
                      >
                        {student.isActive ? <LockOpen /> : <Lock />}
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUser(student._id, "Student")}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
