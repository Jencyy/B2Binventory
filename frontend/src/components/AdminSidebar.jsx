import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Typography,
    Box,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { useNavigate } from "react-router-dom";
  
  const drawerWidth = 240;
  
  const AdminSidebar = ({ onClose }) => {
    const navigate = useNavigate();
  
    const options = [
      { label: "Add User", onClick: () => navigate("/register") },
      { label: "Reset Password", onClick: () => navigate("/reset-password") },
      { label: "Add Product", onClick: () => navigate("/add-product") },
      { label: "Orders", onClick: () => navigate("/orders") },
    ];
  
    return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={true}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <Typography variant="h6">Admin Panel</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {options.map(({ label, onClick }, index) => (
            <ListItem button key={index} onClick={onClick}>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  };
  
  export default AdminSidebar;
  