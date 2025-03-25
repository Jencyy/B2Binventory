import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import EditProduct from "./EditProduct";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../../redux/cartSlice";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const userRole = localStorage.getItem("role") || "user"; // ✅ Fix: Ensure role is set
  const isAdmin = userRole === "admin"; // ✅ Ensure Admin check works

  if (!product || !product.name) {
    console.error("❌ ProductCard received an undefined product:", product);
    return null;
  }

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert("Not enough stock available!");
      return;
    }
    dispatch(addToCartAsync({ productId: product._id, quantity }));
    setOpen(false);
  };

  // ✅ Fix Image Loading: Add Full URL to Images & Video
  const baseURL = "http://localhost:5000"; // Change to your actual backend URL
  const images = product.images.map(img => `${baseURL}${img}`);
  const video = product.video ? `${baseURL}${product.video}` : null;
  const mediaFiles = [...images, ...(video ? [video] : [])]; // Combine images & video

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  };

  return (
    <Card
      sx={{
        maxWidth: 360,
        borderRadius: "12px",
        bgcolor: "var(--white)",
        boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.02)", boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" },
      }}
    >
      {/* ✅ Fixed Image & Video Slider */}
      {mediaFiles.length > 0 ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "220px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "var(--gray)",
            borderRadius: "12px 12px 0 0",
          }}
        >
          {/* Previous Button */}
          {mediaFiles.length > 1 && (
            <IconButton
              onClick={prevMedia}
              sx={{
                position: "absolute",
                left: "10px",
                bgcolor: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          {/* Media Display (Image or Video) */}
          {mediaFiles[currentMediaIndex].endsWith(".mp4") ? (
            <video width="100%" height="100%" controls style={{ borderRadius: "12px 12px 0 0", objectFit: "cover" }}>
              <source src={mediaFiles[currentMediaIndex]} type="video/mp4" />
            </video>
          ) : (
            <img
              src={mediaFiles[currentMediaIndex]}
              alt={`Product ${currentMediaIndex}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
            />
          )}

          {/* Next Button */}
          {mediaFiles.length > 1 && (
            <IconButton
              onClick={nextMedia}
              sx={{
                position: "absolute",
                right: "10px",
                bgcolor: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      ) : (
        <img
          src="/placeholder.jpg"
          alt="Placeholder"
          style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
        />
      )}

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "var(--primary-color)", textAlign: "center" }}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "var(--nandor)" }}>
          Category: {product.category?.name || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "var(--nandor)" }}>
          Price: ${product.price}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "var(--nandor)" }}>
          Stock: {product.stock}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, textAlign: "center", color: "gray" }}>
          {product.description || "No description available"}
        </Typography>

        {/* ✅ Add to Cart Button (for all users) */}
        <Button
          onClick={() => setOpen(true)}
          sx={{
            mt: 2,
            width: "100%",
            bgcolor: "var(--primary-color)",
            color: "var(--white)",
            fontWeight: "bold",
            "&:hover": { bgcolor: "var(--sea-nymph)" },
          }}
        >
          Add to Cart
        </Button>

        {/* Quantity Dialog */}
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
            <Button
              onClick={handleAddToCart}
              sx={{ bgcolor: "var(--primary-color)", color: "var(--white)", "&:hover": { bgcolor: "var(--sea-nymph)" } }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Show Edit & Delete Buttons for Admin */}
        {isAdmin && (
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                width: "50%",
                bgcolor: "var(--primary-color)",
                color: "var(--white)",
                fontWeight: "bold",
                "&:hover": { bgcolor: "red", color: "white" },
              }}
              onClick={() => onDelete(product._id)}
            >
              Delete
            </Button>
            <EditProduct product={product} onUpdate={onUpdate} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
