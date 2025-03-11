import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>B2B Inventory</Typography>

        {userRole === "admin" ? (
          <>
            <Button color="inherit" onClick={() => navigate("/add-product")}>Add Product</Button>
            <Button color="inherit" onClick={() => navigate("/orders")}>View Orders</Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/cart")}>Cart</Button>
            <Button color="inherit" onClick={() => navigate("/my-orders")}>My Orders</Button>
          </>
        )}

        {userName && (
          <Typography variant="subtitle1" sx={{ mx: 2 }}>
            {userName} ({userRole})
          </Typography>
        )}

        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
