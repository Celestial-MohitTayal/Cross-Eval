import React, { useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  SelectChangeEvent,
} from "@mui/material";

interface UserFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    gender: string;
    dob: string;
  }) => Promise<void>;
  initialData?: { name: string; email: string; gender: string; dob: string };
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialData = { name: "", email: "", gender: "", dob: "" },
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setFormData({ ...formData, gender: value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidEmail = validateEmail(formData.email);
    if (!isValidEmail) {
      setError("Please Enter Valid Email");
      return setTimeout(() => {
        setError("");
      }, 5000);
    }
    onSubmit(formData);
    setFormData({ name: "", email: "", gender: "", dob: "" });
  };

  return (
    <>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              type="text"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              fullWidth
              value={formData.dob}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: today, // Disable future dates (select only past dates)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default UserForm;
