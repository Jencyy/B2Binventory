import React, { useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStock, fetchLogins, fetchActivities } from "../redux/adminDashboardSlice";

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box> 
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>Admin Dashboard</Typography>

      <Grid container spacing={3}>
        {/* Low Stock Products */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Low Stock Products</Typography>
              {lowStockProducts.length === 0 ? (
                <Typography>No low stock items.</Typography>
              ) : (
                lowStockProducts.map((product) => (
                  <Typography key={product._id}>
                    {product.name} — {product.stock} left
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Logins */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent User Logins</Typography>
              {recentLogins.length === 0 ? (
                <Typography>No recent logins.</Typography>
              ) : (
                recentLogins.map((user) => (
                  <Typography key={user._id}>
                    {user.email} — {new Date(user.lastLogin).toLocaleString()}
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User Activities */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Activity Logs</Typography>
              {recentActivities.length === 0 ? (
                <Typography>No recent activities.</Typography>
              ) : (
                recentActivities.map((log, idx) => (
                  <Typography key={idx}>
                    {log.action} — {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
