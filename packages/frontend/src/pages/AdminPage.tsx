import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Grid, TextField, Button } from "@mui/material";
import Header from "../components/Header";
import UserForm from "../components/userForm";
import UserTable from "../components/userTable";
import { get, post, put, del } from "../utils/httpHelper";

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Teachers, 1 for Students
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

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
    try {
      const data = await get(`${apiUrl}/admin/get-all-teachers`, token!);
      setTeachers(data);
    } catch (err) {
      setError("Error fetching teachers");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await get(`${apiUrl}/teacher/get-all-student`, token!);
      setStudents(data);
    } catch (err) {
      setError("Error fetching students");
    }
  };

  const handleCreateTeacher = async (data: {
    name: string;
    email: string;
    gender: string;
    dob: string;
  }) => {
    // Validate that DOB is not in the future
    const selectedDate = new Date(data.dob);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize the current date

    if (selectedDate > currentDate) {
      setError("Date of Birth cannot be in the future");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      const response = await post(
        `${apiUrl}/admin/create-teacher`,
        data,
        token!
      );
      alert(response.message);
      fetchTeachers();
    } catch (err: any) {
      setError(err?.message || "Error creating teacher");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleToggleAccess = async (id: string, role: string) => {
    try {
      const response = await put(
        `${apiUrl}/admin/toggle-access/${id}`,
        {},
        token!
      );
      alert(response.message);
      role === "Teacher" ? fetchTeachers() : fetchStudents();
    } catch (err) {
      alert("Error toggling access");
    }
  };

  const handleDeleteUser = async (id: string, role: string) => {
    try {
      const response = await del(`${apiUrl}/admin/delete-users/${id}`, token!);
      alert(response.message);
      role === "Teacher" ? fetchTeachers() : fetchStudents();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  return (
    <div style={{ padding: "20px", paddingTop: "60px" }}>
      <Header />
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        aria-label="User Management Tabs"
      >
        <Tab label="Teachers" />
        <Tab label="Students" />
      </Tabs>

      <Box>
        {activeTab === 0 ? (
          <>
            <Box margin={4}>
              <h2>Create Teacher</h2>
              {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                  {error}
                </div>
              )}
              <UserForm onSubmit={handleCreateTeacher} />
            </Box>
            <Box margin={4}>
              <h2>Teachers List : {teachers.length}</h2>
              <p>Teachers password will be first 4 letter of teacher name + teacher birth year, Example: Name - Teacher 1, DOB: 2025-01-01 than Password: teac2025</p>
              <UserTable
                users={teachers}
                onToggleAccess={handleToggleAccess}
                onDelete={handleDeleteUser}
              />
            </Box>
          </>
        ) : (
          <>
            <Box margin={4}>
              <h2>Students List: {students.length}</h2>
              <UserTable
                users={students}
                onToggleAccess={handleToggleAccess}
                onDelete={handleDeleteUser}
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default AdminPage;
