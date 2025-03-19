import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCartAsync, clearCart } from "../redux/cartSlice";
import { Button } from "@mui/material";

const CartPage = () => {
  const { cartItems = [], loading, error } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart: {error}</p>;

  // Function to generate WhatsApp message
  const handleInquiry = () => {
    if (cartItems.length === 0) return;

    let message = "Hello, I'm interested in these products:\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.productId.name} - Quantity: ${item.quantity}\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "+919664851087"; // Change this to your business WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div>
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            {item?.productId && (
              <>
                <img src={item.productId.image} alt={item.productId.name} width="50px" />
                <h4>{item.productId.name}</h4>
                <span>Quantity: {item.quantity}</span>
                <Button color="error" onClick={() => dispatch(removeFromCartAsync(item.productId._id))}>❌ Remove</Button>
              </>
            )}
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <>
          <Button variant="contained" color="secondary" onClick={handleInquiry}>
            📩 Send Inquiry on WhatsApp
          </Button>
          <Button variant="contained" color="error" onClick={() => dispatch(clearCart())}>
            🗑 Clear Cart
          </Button>
        </>
      )}
    </div>
  );
};

export default CartPage;
