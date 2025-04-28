import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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

import AdminDashboard from "./pages/AdminDashboard";
// import ManageUsers from "./pages/ManageUsers";
// import ManageProducts from "./pages/ManageProducts";
// import ManageCategories from "./pages/ManageCategories";
// import LowStockProducts from "./pages/LowStockProducts";
// import UploadExcelPage from "./pages/UploadExcelPage";

import AdminLayout from "./components/AdminLayout";

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarOn = ["/products", "/"];
  const isAdmin = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role === "admin" : false;

  // Log isAdmin value for debugging purposes
  console.log("isAdmin:", isAdmin);

  return (
    <>
      {/* Show Navbar only if not admin panel page */}
      {!hideNavbarOn.includes(location.pathname) && !location.pathname.startsWith("/admin") && (
        <Navbar />
      )}

      <Routes>
        {/* Public routes */}
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

        {/* Admin panel layout + nested routes */}
        {isAdmin && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        )}

        {/* If user is not admin */}
        {!isAdmin && (
          <Route path="/admin" element={<div>You are not authorized to access this page.</div>} />
        )}
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
