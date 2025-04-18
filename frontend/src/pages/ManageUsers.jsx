import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // Fetch users data from an API or local storage
  useEffect(() => {
    // Example: fetching user data from local storage (replace with API call in real scenario)
    const fetchedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(fetchedUsers);
  }, []);

  // Delete a user (this should also be connected to an API)
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // Update user role (admin/user) (this should also be connected to an API)
  const handleChangeRole = (userId, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      <Button
        component={Link}
        to="/admin/add-user"
        variant="contained"
        sx={{ marginBottom: 2 }}
      >
        Add New User
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handleChangeRole(user.id, user.role === "admin" ? "user" : "admin")
                    }
                  >
                    {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton color="primary" component={Link} to={`/admin/edit-user/${user.id}`}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageUsers;
