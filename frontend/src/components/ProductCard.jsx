import { useState } from "react";
import { Card, CardMedia, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import EditProduct from "./EditProduct";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../../redux/cartSlice";

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role") === "admin";

  if (!product || !product.name) {
    console.error("❌ ProductCard received an undefined product or missing name:", product);
    return null;
  }

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert("Not enough stock available!");
      return;
    }

    dispatch(addToCartAsync({ productId: product._id, quantity }));

    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="140" image={product.image || "/placeholder.jpg"} alt={product.name} />
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="body2">Category: {product.category?.name || "N/A"}</Typography>
        <Typography variant="body2">Price: ${product.price}</Typography>
        <Typography variant="body2">Stock: {product.stock}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {product.description || "No description available"}
        </Typography>

        {product.video && (
          <video width="100%" height="140" controls>
            <source src={product.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Add to Cart Button */}
        <Button onClick={() => setOpen(true)}> 🛒 Add to Cart</Button>

        {/* Quantity Dialog Box */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Select Quantity</DialogTitle>
          <DialogContent>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
              inputProps={{ min: 1, max: product.stock }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddToCart} color="primary">Confirm</Button>
          </DialogActions>
        </Dialog>

        {isAdmin && (
          <>
            <Button color="error" onClick={() => onDelete(product._id)}>Delete</Button>
            <EditProduct product={product} onUpdate={onUpdate} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
