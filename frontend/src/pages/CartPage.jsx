import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCartAsync, increaseQuantityAsync, decreaseQuantityAsync, clearCart } from "../redux/cartSlice";
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
          <div key={item.productId._id} className="cart-item">
            <img src={item.productId.image} alt={item.productId.name} width="50px" />
            <h4>{item.productId.name}</h4>

            <Button onClick={() => dispatch(decreaseQuantityAsync(item.productId._id))}>➖</Button>
            <TextField type="number" value={item.quantity} disabled />
            <Button onClick={() => dispatch(increaseQuantityAsync(item.productId._id))}>➕</Button>

            <Button color="error" onClick={() => dispatch(removeFromCartAsync(item.productId._id))}>❌ Remove</Button>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <Button variant="contained" color="secondary" onClick={() => dispatch(clearCart())}>🗑 Clear Cart</Button>
      )}
    </div>
  );
};

export default CartPage;
