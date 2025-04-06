import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent } from "@mui/material";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => setOrders(res.data))
    .catch((err) => console.error("Error fetching orders", err));
  }, []);

  return (
    <Container>
      <Typography variant="h4">My Orders</Typography>
      {orders.map((order) => (
        <Card key={order._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Order ID: {order._id}</Typography>
            <Typography>Status: {order.status}</Typography>
            <Typography>Products:</Typography>
            {order.product ? (
              <Typography>{order.product.name} - {order.quantity} pcs</Typography>
            ) : (
              <Typography>Product Deleted</Typography>
            )}
            <Typography>Total: ${order.totalPrice}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Orders;
