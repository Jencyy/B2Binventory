import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrderAsync } from "../redux/orderSlice";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();

  const { canceling, cancelError } = useSelector((state) => state.order);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("🔄 Orders fetched after cancel:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await dispatch(cancelOrderAsync(orderId)).unwrap();
      // Filter out the cancelled order from the list:
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error cancelling order", err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {cancelError && (
        <Typography color="error">Error: {cancelError}</Typography>
      )}

      {orders.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="40vh"
          mt={4}
        >
          <img
            src="/no-orders.png" // optional: add image in public folder
            alt="No orders"
            style={{ maxWidth: 200, marginBottom: 16 }}
          />
          <Typography variant="h6" color="text.secondary">
            You don’t have any orders yet.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/products")}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography>Order ID: {order._id}</Typography>
              <Typography>Status: {order.status}</Typography>
              <Typography>Products:</Typography>
              {order.product ? (
                <Typography>
                  {order.product.name} - {order.quantity} pcs
                </Typography>
              ) : (
                <Typography>Product Deleted</Typography>
              )}
              <Typography>Total: ${order.totalPrice}</Typography>
              {order.status === "pending" && (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 1 }}
                  disabled={canceling}
                  onClick={() => handleCancelOrder(order._id)}
                >
                  {canceling ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;
