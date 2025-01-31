import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { put, get } from "../utils/httpHelper";

interface EditUserzModalProps {
  open: boolean;
  onClose: () => void;
  id: string | null;
  fetchUsers?: () => Promise<void>;
}

const EditUserModal: React.FC<EditUserzModalProps> = ({
  open,
  onClose,
  id,
  fetchUsers,
}) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
  });
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      get(`${apiUrl}/admin/get-user/${id}`, token!)
        .then((data) =>
          setUserData({
            name: data.name,
            email: data.email,
            gender: data.gender,
            dob: data.dob.split("T")[0],
          })
        )
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [id]);

  const handleChange = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await put(`${apiUrl}/admin/edit-user/${id}`, userData, token!);
      alert("User updated successfully!");
      if (fetchUsers) {
        fetchUsers();
      }
      onClose();
    } catch (err) {
      alert("Error updating user");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          p: 3,
          bgcolor: "white",
          m: "auto",
          mt: 10,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Edit Quiz</Typography>
        <TextField
          label="Name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Gender"
          name="gender"
          value={userData.gender}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Dob"
          type="date"
          name="dob"
          value={userData.dob}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
