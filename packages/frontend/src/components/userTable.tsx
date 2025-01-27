import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Lock, LockOpen, Delete } from "@mui/icons-material";

interface UserTableProps {
  users: any[];
  handleToggleAccess: (id: string, role: string) => void;
  handleDeleteUser: (id: string, role: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, handleToggleAccess, handleDeleteUser }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Access</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleToggleAccess(user._id, user.role)}>
                  {user.isActive ? <LockOpen /> : <Lock />}
                </IconButton>
                <IconButton onClick={() => handleDeleteUser(user._id, user.role)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
