import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData?.role || "";
  const userName = userData?.name || null;
  const userAvatar = userData?.avatar || "/default-avatar.png";
  const cartCount = useSelector((state) => state.cart?.cartItems?.length || 0);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    if (event?.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    // Close menu on route change
    setAnchorEl(null);
  }, [location.pathname]);

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "var(--primary-color)", color: "var(--white)", py: 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT SIDE: Logo + Burger */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {onMenuClick && (
            <IconButton onClick={onMenuClick} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", fontWeight: "bold" }}
          >
            Inventory
          </Typography>
        </Box>

        {/* CENTER NAV LINKS */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button onClick={() => navigate("/")} sx={navBtnStyle}>
            Home
          </Button>
          <Button onClick={() => navigate("/products")} sx={navBtnStyle}>
            Products
          </Button>
          <Button component={Link} to="/wishlist" sx={navBtnStyle}>
            Wishlist
          </Button>
          <Button onClick={() => navigate("/contact")} sx={navBtnStyle}>
            Contact
          </Button>
          {userRole === "admin" && !location.pathname.startsWith("/admin") && (
            <Button onClick={() => navigate("/admin/dashboard")} sx={navBtnStyle}>
              Settings
            </Button>
          )}

          {/* Only non-admins get Cart + Orders here */}
          {userRole !== "admin" && (
            <>
              <Link to="/cart">
                <IconButton sx={{ color: "white" }}>
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
              <Button onClick={() => navigate("/orders")} sx={navBtnStyle}>
                My Orders
              </Button>
            </>
          )}
        </Box>

        {/* RIGHT SIDE: Avatar + Dropdown */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {userName && (
            <>
              <Avatar
                src={userAvatar}
                alt={userName}
                sx={{ width: 40, height: 40, border: "2px solid white", cursor: "pointer" }}
                onClick={handleMenuOpen}
              />
              <Typography>{userName}</Typography>
            </>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const navBtnStyle = {
  color: "white",
  textTransform: "none",
};

export default Navbar;
