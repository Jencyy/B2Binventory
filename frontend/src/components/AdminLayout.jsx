import React from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
<Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
  {/* Sidebar */}
  <AdminSidebar /> {/* This will naturally take 240px width */}

  {/* Main Content */}
  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden", // prevent x-scroll
    }}
  >
    <AdminTopbar onLogout={handleLogout} />

    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        overflowX: "hidden",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Outlet />
    </Box>
  </Box>
</Box>

  );
};

export default AdminLayout;
