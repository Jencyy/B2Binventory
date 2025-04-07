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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const Navbar = ({ onMenuClick, onSettingClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData?.role || "";
  const userName = userData?.name || null;
  const userAvatar = userData?.avatar || "/default-avatar.png";
  const cartCount = useSelector((state) => state.cart?.cartItems?.length || 0);

  const [anchorEl, setAnchorEl] = useState(null);


  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };



  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "var(--primary-color)", color: "var(--white)", py: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* LEFT SIDE: Logo + Burger if on Home */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* ✅ Show burger icon only when prop is passed */}
            {onMenuClick && (
              <IconButton onClick={onMenuClick} sx={{ color: "white" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" onClick={() => navigate("/")} sx={{ cursor: "pointer", fontWeight: "bold" }}>
              Inventory
            </Typography>
          </Box>

          {/* CENTER: Main Nav */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button onClick={() => navigate("/")} sx={{ color: "white", textTransform: "none" }}>
              Home
            </Button>
            <Button onClick={() => navigate("/products")} sx={{ color: "white", textTransform: "none" }}>
              Products
            </Button>
            <Button onClick={() => navigate("/add-category")} sx={{ color: "white", textTransform: "none" }}>
              Add Category
            </Button>
            <Button component={Link} to="/wishlist" sx={{ color: "white", textTransform: "none" }}>
              My Wishlist
            </Button>
            <Button onClick={() => navigate("/contact")} sx={{ color: "white", textTransform: "none" }}>
              Contact
            </Button>

            {userRole === "admin" ? (
              <>
                <Button onClick={() => navigate("/add-product")} sx={{ color: "white", textTransform: "none" }}>
                  Add Product
                </Button>
                <Button onClick={() => navigate("/orders")} sx={{ color: "white", textTransform: "none" }}>
                  View Orders
                </Button>
                <Button
                  onClick={onSettingClick}
                  sx={{ color: "white", textTransform: "none" }} >
                  Settings
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "white",
                    border: "1px solid white",
                    borderRadius: 1,
                    px: 2,
                    py: 0.5,
                    textTransform: "none",
                  }}
                >
                  Register User
                </Button>
              </>
            ) : (
              <>
                <Link to="/cart">
                  <IconButton sx={{ color: "white" }}>
                    <Badge badgeContent={cartCount} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Link>
                <Button onClick={() => navigate("/orders")} sx={{ color: "white", textTransform: "none" }}>
                  My Orders
                </Button>
              </>
            )}
          </Box>

          {/* RIGHT SIDE: Avatar + Menu */}
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
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>


    </>
  );
};

export default Navbar;
