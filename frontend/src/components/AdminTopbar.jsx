// components/AdminTopbar.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const AdminTopbar = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box
      sx={{
        height: 60,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Welcome, {user?.name || "Admin"}
      </Typography>
      <Button color="black" variant="outlined" onClick={onLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default AdminTopbar;
