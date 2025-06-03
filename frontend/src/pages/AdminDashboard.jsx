import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Inventory2 as InventoryIcon,
  PersonAdd as PersonAddIcon,
  Category as CategoryIcon,
  CloudUpload as UploadIcon,
  People as UsersIcon,
  ShoppingCart as ProductIcon,
  Warning as LowStockIcon,
  Lock as LockIcon, // ✅ Correct icon for Reset Password section
  History as ActivityIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { fetchLowStock, fetchLogins, fetchActivities } from "../redux/adminDashboardSlice";

// Components
import Register from "./Register";
import AddProduct from "./AddProduct";
import ManageProducts from "./ManageProducts";
import ManageUsers from "./ManageUsers";
import ManageCategories from "./ManageCategories";
import UploadExcelPage from "./UploadExcelPage";
import LowStockProducts from "./LowStockProducts";
import ResetPassword from "../components/ResetPassword";

const SectionCard = ({ id, icon, title, children }) => {
  const theme = useTheme();
  return (
    <Card id={id} elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography
            variant="h6"
            fontWeight="bold"
            ml={1}
            color={theme.palette.primary.main}
          >
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { lowStockProducts, recentLogins, recentActivities, loading } = useSelector(
    (state) => state.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchLowStock());
    dispatch(fetchLogins());
    dispatch(fetchActivities());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ p: 4, ml: { md: 30 }, overflow: "hidden" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SectionCard id="low-stock-overview" icon={<LowStockIcon color="error" />} title="Low Stock Overview">
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                lowStockProducts.map((p) => (
                  <Typography key={p._id}>
                    {p.name} — <strong>{p.stock}</strong> left
                  </Typography>
                ))
              )}
            </SectionCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <SectionCard
              id="recent-logins"
              icon={<LoginIcon />}
              title="Recent Logins"
            >
              {recentLogins.length === 0 ? (
                <Typography>No recent logins</Typography>
              ) : (
                recentLogins.map((user) => (
                  user.lastLogin ?
                    <Typography key={user._id}>
                      {user.email} —{" "}
                      <strong>
                        {new Date(user.lastLogin).toLocaleString()}
                      </strong>
                    </Typography>
                    :
                    ""
                ))
              )}

            </SectionCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <SectionCard id="activity-logs" icon={<ActivityIcon />} title="Activity Logs">
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                recentActivities.length === 0 ? (
                  <Typography>No activity logs available</Typography>
                ) : (
                  recentActivities.map((log, idx) => (
                    <Typography key={idx}>{log.action}</Typography>
                  ))
                )
              )}
            </SectionCard>

          </Grid>
        </Grid>

        <SectionCard id="register" icon={<PersonAddIcon />} title="Register User">
          <Register />
        </SectionCard>

        <SectionCard id="add-product" icon={<ProductIcon />} title="Add Product">
          <AddProduct />
        </SectionCard>

        <SectionCard id="manage-products" icon={<InventoryIcon />} title="Manage Products">
          <ManageProducts />
        </SectionCard>

        <SectionCard id="manage-users" icon={<UsersIcon />} title="Manage Users">
          <ManageUsers />
        </SectionCard>

        <SectionCard id="manage-categories" icon={<CategoryIcon />} title="Manage Categories">
          <ManageCategories />
        </SectionCard>

        <SectionCard id="upload-excel" icon={<UploadIcon />} title="Upload Excel">
          <UploadExcelPage />
        </SectionCard>

        <SectionCard id="low-stock" icon={<LowStockIcon />} title="Low Stock Products">
          <LowStockProducts />
        </SectionCard>
        <SectionCard id="reset-password" icon={<LockIcon />} title="Reset Password">
          <ResetPassword />
        </SectionCard>
      </Box>
    </motion.div>);
};

export default AdminDashboard;
