import React, { ChangeEvent } from "react";
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface UserFormProps {
  userData: any;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<{ name?: string; value: unknown }>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userData, handleChange, handleSelectChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Name" name="name" fullWidth value={userData.name} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Email" name="email" fullWidth value={userData.email} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select name="gender" value={userData.gender} onChange={handleSelectChange}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Date of Birth" name="dob" fullWidth type="date" value={userData.dob} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>Create Teacher</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
