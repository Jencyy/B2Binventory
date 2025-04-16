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
      for (const item of cartItems) {
        await dispatch(
          placeOrderAsync({
            productId: item.productId._id,
            quantity: item.quantity,
            address: "Default Address", // You can make this dynamic with a form
            paymentMethod: "COD",       // You can let user choose
          })
        ).unwrap();
      }
  
      dispatch(clearCart());
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
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
        <Typography>Your cart is empty.</Typography>
      ) : (
        cartItems.map((item) => {
          if (!item.productId) return null;

          return (
            <Card key={item._id} sx={{ display: "flex", mb: 2, p: 2, alignItems: "center", boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={
                  item.productId.images?.length > 0
                    ? `${baseURL}${item.productId.images[0]}`
                    : "/placeholder.jpg"
                }
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
