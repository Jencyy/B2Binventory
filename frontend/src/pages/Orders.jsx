import { useState, useEffect } from "react";
import { Container, Button, Typography, TextField } from "@mui/material";
import axios from "axios";

const Orders = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then(res => setProducts(res.data));
  }, []);

  const placeOrder = async (productId, quantity) => {
    try {
      await axios.post("http://localhost:5000/api/orders/place", {
        productId,
        quantity,
        address: "123 Street, NY",
        paymentMethod: "Credit Card",
      });
      alert("Order Placed!");
    } catch (error) {
      alert("Failed to place order.");
    }
  };

  return (
    <Container>
      <Typography variant="h4">Order Products</Typography>
      {products.map(product => (
        <div key={product._id}>
          <Typography>{product.name} - ${product.price}</Typography>
          <TextField type="number" placeholder="Quantity" />
          <Button onClick={() => placeOrder(product._id, 1)}>Order</Button>
        </div>
      ))}
    </Container>
  );
};

export default Orders;
