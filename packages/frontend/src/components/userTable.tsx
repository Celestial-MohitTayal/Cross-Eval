import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Lock, LockOpen, Delete } from "@mui/icons-material";

interface UserTableProps {
  users: any[];
  onToggleAccess: (id: string, role: string) => void;
  onDelete: (id: string, role: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onToggleAccess,
  onDelete,
}) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Emp-Id</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Gender</TableCell>
          <TableCell>DOB</TableCell>
          <TableCell>Access</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell>{user.userId}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.gender}</TableCell>
            <TableCell>{user.dob.slice(0, 10)}</TableCell>
            <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell>
              <IconButton onClick={() => onToggleAccess(user._id, user.role)}>
                {user.isActive ? <LockOpen /> : <Lock />}
              </IconButton>
              <IconButton onClick={() => onDelete(user._id, user.role)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UserTable;
