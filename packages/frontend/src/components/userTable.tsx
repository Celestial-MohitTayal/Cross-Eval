import React, { useState } from "react";
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
import { Lock, LockOpen, Delete, Edit } from "@mui/icons-material";
import EditUserModal from "./EditUserModal";

interface UserTableProps {
  users: any[];
  onToggleAccess: (id: string, role: string) => void;
  onDelete: (id: string, role: string) => void;
  fetchUsers?: () => Promise<void>;
  setSuccess?: (value: string | null) => void;
  setError?: (value: string | null) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onToggleAccess,
  onDelete,
  fetchUsers,
  setSuccess,
  setError
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleEditUser = (id: string) => {
    setSelectedUserId(id);
    setEditModalOpen(true);
  };

  return (
    <>
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
                  <IconButton
                    onClick={() => onToggleAccess(user._id, user.role)}
                  >
                    {user.isActive ? <LockOpen /> : <Lock />}
                  </IconButton>
                  {fetchUsers &&
                  <IconButton onClick={() => handleEditUser(user._id)}>
                    <Edit />
                  </IconButton>}
                  <IconButton onClick={() => onDelete(user._id, user.role)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {setSuccess && setError && 
      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        id={selectedUserId}
        fetchUsers={fetchUsers}
        setError={setError}
        setSuccess={setSuccess}
      />}
    </>
  );
};

export default UserTable;
