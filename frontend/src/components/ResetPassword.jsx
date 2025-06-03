// src/components/ResetPassword.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/authSlice";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ email, newPassword }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        fullWidth
        required
      />
      <Button variant="contained" color="primary" type="submit" disabled={loading}>
        Reset Password
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default ResetPassword;
