// components/AdminTopbar.jsx
import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home'; // Make sure this import is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

const AdminTopbar = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle navigation to the home page
  const handleNavigateHome = () => {
    navigate("/"); // You can change "/" to any path you'd like
  };

  return (
    <Box
      sx={{
        height: 50,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: "1px solid #ddd",
        boxShadow: 1, // Add shadow for depth
      }}
    >
      {/* Left: Home Button */}
      <IconButton 
        color="primary" 
        onClick={handleNavigateHome}  // Use the navigation handler here
        sx={{
          marginLeft: 30, // Add margin to the left
        }}
      >
        <HomeIcon />
      </IconButton>

      {/* Center: Welcome Message */}
      <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
        Welcome, {user?.name || "Admin"}
      </Typography>

      {/* Right: Logout Button */}
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={onLogout}
        sx={{
          padding: "6px 16px", 
          fontWeight: "bold", 
          borderRadius: 2, 
          textTransform: "none"
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default AdminTopbar;
