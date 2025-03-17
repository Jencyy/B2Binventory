import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCartAsync, clearCart } from "../redux/cartSlice";
import { Button, TextField } from "@mui/material";

const CartPage = () => {
  const { cartItems = [], loading, error } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart: {error}</p>;

  return (
    <div>
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.productId.image} alt={item.productId.name} width="50px" />
            <h4>{item.productId.name}</h4>
            <TextField type="number" value={item.quantity} inputProps={{ min: 1 }} />
            <Button color="error" onClick={() => dispatch(removeFromCartAsync(item.productId._id))}>
              ❌ Remove
            </Button>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <Button variant="contained" color="secondary" onClick={() => dispatch(clearCart())}>
          🗑 Clear Cart
        </Button>
      )}
    </div>
  );
};

export default CartPage;
