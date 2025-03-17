import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
const Navbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const cartCount = useSelector((state) => state.cart?.cartItems?.length || 0);

 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}> <Button onClick={() => navigate("/")} color="inherit">B2B Inventory</Button></Typography>

        {userRole === "admin" ? (
          <>
            <Button color="inherit" onClick={() => navigate("/add-product")}>Add Product</Button>
            <Button color="inherit" onClick={() => navigate("/orders")}>View Orders</Button>
          </>
        ) : (
          <>
            <Link to="/cart">
              <IconButton color="inherit">
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />  
                </Badge>
              </IconButton>
            </Link>
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
  )
};

export default Navbar;
