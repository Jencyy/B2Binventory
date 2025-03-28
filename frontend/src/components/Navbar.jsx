import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
} from "@mui/material";
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
    <AppBar
      position="static"
      sx={{
        bgcolor: "var(--primary-color)",
        color: "var(--white)",
        padding: "10px 0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Home */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
           Inventory
        </Typography>

        {/* Admin Navigation */}
        {userRole === "admin" ? (
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Button
              sx={{
                color: "var(--white)",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </Button>
            <Button
              sx={{
                color: "var(--white)",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={() => navigate("/orders")}
            >
              View Orders
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Link to="/cart">
              <IconButton sx={{ color: "var(--white)" }}>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>
            <Button
              sx={{
                color: "var(--white)",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={() => navigate("/orders")}
            >
              My Orders
            </Button>
          </Box>
        )}

        {/* User Info & Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {userName && (
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {userName} ({userRole})
            </Typography>
          )}
          <Button
            sx={{
              bgcolor: "var(--white)",
              color: "var(--primary-color)",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "var(--sea-nymph)" },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
