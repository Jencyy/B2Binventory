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
import { useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // Get user role from local storage
  const user = localStorage.getItem("user"); // Get user role from local storage

  const cartCount = useSelector((state) => state.cart?.cartItems?.length || 0);

console.log(userRole,"dsfdasa")

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
if (!user ) {
  console.log("User not logged in");
}

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

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {/* Admin-Specific Buttons */}
          {userRole === "admin" && (
            <>
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
              {/* ✅ Admin-Only "Register User" Button */}
              <Button
                sx={{
                  color: "var(--white)",
                  fontWeight: "bold",
                  textTransform: "none",
                  border: "1px solid var(--white)",
                  borderRadius: "5px",
                  padding: "5px 10px",
                }}
                onClick={() => navigate("/register")}
              >
                Register User
              </Button>
            </>
          )}

          {/* User Buttons */}
          {userRole !== "admin" && (
            <>
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
            </>
          )}
        </Box>

        {/* User Info & Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
