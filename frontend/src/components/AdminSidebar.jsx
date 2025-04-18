import React from "react";
import { Box, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        {/* Links to Admin Sections */}
        <ListItem button component={Link} to="/admin/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/admin/manage-products">
          <ListItemText primary="Manage Products" />
        </ListItem>
        <ListItem button component={Link} to="/admin/manage-categories">
          <ListItemText primary="Manage Categories" />
        </ListItem>
        <ListItem button component={Link} to="/admin/manage-users">
          <ListItemText primary="Manage Users" />
        </ListItem>
        <ListItem button component={Link} to="/admin/low-stock">
          <ListItemText primary="Low Stock Products" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
