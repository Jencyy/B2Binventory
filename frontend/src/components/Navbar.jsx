import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
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
        bgcolor: "var(--primary-color)", // 🟢 Primary Green Background
        color: "var(--white)", // 🔥 White Text for Contrast
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          <Button
            onClick={() => navigate("/")}
            sx={{ color: "var(--white)", fontSize: "18px" }}
          >
            🏢 B2B Inventory
          </Button>
        </Typography>

        {userRole === "admin" ? (
          <>
            <Button
              sx={{ color: "var(--white)", fontWeight: "bold" }}
              onClick={() => navigate("/add-product")}
            >
              ➕ Add Product
            </Button>
            <Button
              sx={{ color: "var(--white)", fontWeight: "bold" }}
              onClick={() => navigate("/orders")}
            >
              📦 View Orders
            </Button>
          </>
        ) : (
          <>
            <Link to="/cart">
              <IconButton sx={{ color: "var(--white)" }}>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>
            <Button
              sx={{ color: "var(--white)", fontWeight: "bold" }}
              onClick={() => navigate("/my-orders")}
            >
              🛍️ My Orders
            </Button>
          </>
        )}

        {userName && (
          <Typography variant="subtitle1" sx={{ mx: 2, fontWeight: "bold" }}>
            {userName} ({userRole})
          </Typography>
        )}

        <Button
          sx={{
            bgcolor: "var(--white)",
            color: "var(--primary-color)",
            "&:hover": { bgcolor: "var(--sea-nymph)" },
            fontWeight: "bold",
          }}
          onClick={handleLogout}
        >
          🚪 Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
