import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import Expired from "./pages/Expired";
import AddCategory from "./components/AddCategory";
import WishlistPage from "./pages/WishlistPage";
import Products from "./pages/Products";
import AdminSidebar from "./components/AdminSidebar";

import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageProducts from "./pages/ManageProducts";
import ManageCategories from "./pages/ManageCategories";
import LowStockProducts from "./pages/LowStockProducts";

import { Box } from "@mui/material";

const AppRoutes = () => {
  const location = useLocation();
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const hideNavbarOn = ["/products","/"];
  const isAdmin = localStorage.getItem("role") === "admin";

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar always renders for admin */}
      {isAdmin && showAdminSidebar && (
        <AdminSidebar onClose={() => setShowAdminSidebar(false)} />
      )}

      <Box sx={{ flexGrow: 1 }}>
        {/* Navbar only when allowed */}
        {!hideNavbarOn.includes(location.pathname) && (
          <Navbar onSettingClick={() => setShowAdminSidebar(true)} />
        )}

        {/* All your routed pages go here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/expired" element={<Expired />} />
          <Route path="/products" element={<Products />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-products" element={<ManageProducts />} />
          <Route path="/admin/manage-categories" element={<ManageCategories />} />
          <Route path="/admin/low-stock" element={<LowStockProducts />} />

        </Routes>
      </Box>
    </Box>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
