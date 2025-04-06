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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData?.role || "";
  const userName = userData?.name || null;
  const userAvatar = userData?.avatar || "/default-avatar.png";
  const cartCount = useSelector((state) => state.cart?.cartItems?.length || 0);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Sidebar Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  // ✅ Sample Filter Options
  const filterOptions = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Home Appliances",
    "Footwear",
  ];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "var(--primary-color)",
          color: "var(--white)",
          padding: "10px 0",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* ✅ Left Side: Burger + Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {location.pathname === "/" && (
              <IconButton
                edge="start"
                sx={{ color: "var(--white)" }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Inventory
            </Typography>
          </Box>

          {/* ✅ Navigation Links */}
          <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Button
              sx={{ color: "var(--white)", textTransform: "none" }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              sx={{ color: "var(--white)", textTransform: "none" }}
              onClick={() => navigate("/products")}
            >
              Products
            </Button>
            <Button
              sx={{ color: "var(--white)", textTransform: "none" }}
              onClick={() => navigate("/add-category")}
            >
              Add category
            </Button>
            <Button component={Link} to="/wishlist" sx={{ color: "#fff" }}>
            My Wishlist
          </Button>

            <Button
              sx={{ color: "var(--white)", textTransform: "none" }}
              onClick={() => navigate("/contact")}
            >
              Contact
            </Button>

            {/* ✅ Admin-Specific Buttons */}
            {userRole === "admin" && (
              <>
                <Button
                  sx={{ color: "var(--white)", textTransform: "none" }}
                  onClick={() => navigate("/add-product")}
                >
                  Add Product
                </Button>
                <Button
                  sx={{ color: "var(--white)", textTransform: "none" }}
                  onClick={() => navigate("/orders")}
                >
                  View Orders
                </Button>
                <Button
                  sx={{
                    color: "var(--white)",
                    border: "1px solid var(--white)",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    textTransform: "none",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Register User
                </Button>
              </>
            )}

            {/* ✅ User-Specific Buttons */}
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
                  sx={{ color: "var(--white)", textTransform: "none" }}
                  onClick={() => navigate("/orders")}
                >
                  My Orders
                </Button>
              </>
            )}
          </Box>

          {/* ✅ User Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {userName && (
              <>
                <Avatar
                  src={userAvatar}
                  sx={{
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    border: "2px solid var(--white)",
                  }}
                  onClick={handleMenuOpen}
                />
                <Typography>{userName}</Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Sidebar Drawer for Filters */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, padding: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Divider />
          <List>
            {filterOptions.map((option, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  console.log("Filter by:", option);
                  // applyFilter(option); // if using Redux or Query Params
                }}
              >
                <ListItemText primary={option} />
              </ListItem>
            ))}
            
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
