import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PersonAdd,
  Inventory,
  People,
  Category,
  CloudUpload,
  Warning,
} from "@mui/icons-material";

const sections = [
  { id: "low-stock-overview", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "register", label: "Register User", icon: <PersonAdd /> },
  { id: "add-product", label: "Add Product", icon: <Inventory /> },
  { id: "manage-products", label: "Manage Products", icon: <Inventory /> },
  { id: "manage-users", label: "Manage Users", icon: <People /> },
  { id: "manage-categories", label: "Manage Categories", icon: <Category /> },
  { id: "upload-excel", label: "Upload Excel", icon: <CloudUpload /> },
  { id: "low-stock", label: "Low Stock", icon: <Warning /> },
];

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const AdminSidebar = () => {
  return (
    <Drawer
    variant="permanent"
    anchor="left"
    sx={{
      "& .MuiDrawer-paper": {
        width: 240,
        boxSizing: "border-box",
      },
    }}
  >
      <List>
        {sections.map((section) => (
          <ListItem
            button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
          >
            <ListItemIcon>{section.icon}</ListItemIcon>
            <ListItemText primary={section.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default AdminSidebar;
