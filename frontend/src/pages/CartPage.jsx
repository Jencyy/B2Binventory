import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { Button, TextField } from "@mui/material";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} width="50px" />
            <h4>{item.name}</h4>
            <TextField
              type="number"
              value={item.quantity}
              onChange={(e) => dispatch(updateQuantity({ id: item._id, quantity: Number(e.target.value) }))}
              inputProps={{ min: 1 }}
            />
            <Button color="error" onClick={() => dispatch(removeFromCart(item._id))}>
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
