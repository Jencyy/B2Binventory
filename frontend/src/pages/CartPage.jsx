import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchCart, removeFromCartAsync, clearCart } from "../redux/cartSlice";
import { Button, Typography, Box, Card, CardMedia, CardContent } from "@mui/material";
import { placeOrderAsync } from "../redux/orderSlice";

const CartPage = () => {
  const { cartItems = [], loading, error } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const baseURL = "http://localhost:5000";

  const handleInquiry = () => {
    if (cartItems.length === 0) return;

    let message = "Hello, I'm interested in these products:\n\n";
    cartItems.forEach((item, index) => {
      if (!item.productId) return;
      message += `${index + 1}. ${item.productId.name} - Quantity: ${item.quantity}\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "+919664851087";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const handlePlaceOrder = async () => {
    try {
      // Ensure the cart has items
      if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
      }
  
      // Loop through the cart and place an order for each item
      for (const item of cartItems) {
        await dispatch(
          placeOrderAsync({
            productId: item.productId._id,
            quantity: item.quantity,
            address: "Default Address",
            paymentMethod: "COD",
          })
        ).unwrap();
      }
  
      // After placing the order, clear the cart
      dispatch(clearCart()); // Clear the cart in Redux
  
      // Optionally, clear cart data from the backend too if needed
      await axios.delete('/api/cart/clear'); // Example endpoint to clear the cart from the server if required
  
      // Navigate to the Orders page after clearing the cart
      navigate("/orders");
  
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error while placing your order.");
    }
  };
  // In your CartPage component, where you want to clear the cart
const handleClearCart = async () => {
  try {
    await axios.delete('http://localhost:5000/api/cart/clear');  // Clear cart on backend
    dispatch(clearCart());  // Update Redux store
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

  
  if (loading) return <Typography>Loading cart...</Typography>;
  if (error) return <Typography color="error">Error loading cart: {error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "var(--primary-color)" }}>
        Your Cart
      </Typography>
  
      {cartItems.length === 0 ? (
        // If there are no items in the cart, show this message
        <Typography>Your cart is empty.</Typography>
      ) : (
        // If there are items, show the cart items
        cartItems.map((item) => {
          if (!item.productId) return null;
  
          return (
            <Card key={item._id} sx={{ display: "flex", mb: 2, p: 2, alignItems: "center", boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={item.productId.images?.length > 0 ? `${baseURL}${item.productId.images[0]}` : "/placeholder.jpg"}
                alt={item.productId.name}
                sx={{ width: 80, height: 80, borderRadius: "8px", objectFit: "cover", mr: 2 }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{item.productId.name}</Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
              </CardContent>
  
              <Button
                variant="contained"
                color="error"
                sx={{ fontWeight: "bold", ml: 2 }}
                onClick={() => dispatch(removeFromCartAsync(item.productId._id))}
              >
                Remove
              </Button>
            </Card>
          );
        })
      )}
  
      {cartItems.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "var(--primary-color)",
              color: "var(--white)",
              fontWeight: "bold",
              "&:hover": { bgcolor: "var(--sea-nymph)" },
            }}
            onClick={handleInquiry}
          >
            Send Inquiry on WhatsApp
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: "bold" }}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ fontWeight: "bold" }}
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </Button>
        </Box>
      )}
    </Box>
  );
  
};

export default CartPage;
