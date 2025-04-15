import { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Button, Dialog, Box,
  IconButton, TextField
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist, removeFromWishlist, fetchWishlist
} from "../redux/wishlistSlice";
import { addToCartAsync } from "../redux/cartSlice";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditProduct from "./EditProduct";

const baseURL = "http://localhost:5000";

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const isAdmin = user?.role === "admin";
  const isInWishlist = wishlist.some(item => {
    const id = typeof item.productId === "string" ? item.productId : item.productId?._id;
    return id === product._id;
  });
  
  
  

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  // Combine images and optional video
  const mediaFiles = [
    ...product.images.map(img => `${baseURL}${img}`),
    ...(product.video ? [`${baseURL}${product.video}`] : [])
  ];

  useEffect(() => {
    dispatch(fetchWishlist());
  }, []);

  // Add or remove from wishlist
  const handleWishlist = () => {
    if (!user?.id) return alert("Please login to manage wishlist");
    const payload = { productId: product._id, userId: user.id };
    dispatch(isInWishlist ? removeFromWishlist(product._id) : addToWishlist(payload));
  };

  const handleInquiry = () => {
    const message = `Hello, I'm interested in "${product.name}". Can you provide more details?`;
    window.open(`https://wa.me/+919664851087?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleAddToCart = () => {
    if (quantity < 1 || quantity > product.stock)
      return alert("Invalid quantity selected.");
    dispatch(addToCartAsync({ productId: product._id, quantity }));
    setOpen(false);
  };

  if (!product?.name) return null;

  return (
    <Card sx={{
      maxWidth: 360,
      borderRadius: 3,
      bgcolor: "#fff",
      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease",
      "&:hover": { transform: "scale(1.03)" },
      position: "relative"
    }}>
      {/* Wishlist Heart Icon */}
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
        <IconButton onClick={handleWishlist} sx={{
          color: isInWishlist ? "red" : "gray",
          bgcolor: "#ffffffcc",
          "&:hover": { bgcolor: "#ffffffee" }
        }}>
          {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* Image or Video */}
      <Box sx={{ height: 220, position: "relative", bgcolor: "#ddd" }}>
        {mediaFiles.length > 0 ? (
          mediaFiles[currentMediaIndex].endsWith(".mp4") ? (
            <video src={mediaFiles[currentMediaIndex]} controls width="100%" height="100%" style={{ objectFit: "cover" }} />
          ) : (
            <img src={mediaFiles[currentMediaIndex]} alt="product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )
        ) : (
          <img src="/placeholder.jpg" alt="placeholder" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}

        {/* Media Switch Arrows */}
        {mediaFiles.length > 1 && (
          <>
            <IconButton onClick={() => setCurrentMediaIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length)}
              sx={{
                position: "absolute", top: "50%", left: 8,
                color: "white", bgcolor: "rgba(0,0,0,0.3)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.5)" }
              }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton onClick={() => setCurrentMediaIndex((prev) => (prev + 1) % mediaFiles.length)}
              sx={{
                position: "absolute", top: "50%", right: 8,
                color: "white", bgcolor: "rgba(0,0,0,0.3)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.5)" }
              }}>
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Product Details */}
      <CardContent sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>{product.name}</Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mt: 0.5 }}>
          Category: {product.category?.name || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mb: 1 }}>
          Stock: {product.stock}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          <Button onClick={() => setOpen(true)} variant="contained" sx={{ borderRadius: 2 , bgcolor: "#000"}}>Add to Cart</Button>
          <Button onClick={handleInquiry} variant="contained" sx={{ borderRadius: 2 ,bgcolor: "#000" }}>Inquiry on WhatsApp</Button>
        </Box>

        {/* Admin actions */}
        {isAdmin && (
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button onClick={() => onDelete(product._id)} variant="contained" color="error">Delete</Button>
            <EditProduct product={product} onUpdate={onUpdate} />
          </Box>
        )}
      </CardContent>

      {/* Quantity Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          px: 4, py: 3, display: "flex",
          flexDirection: "column", gap: 2, alignItems: "center"
        }}>
          <Typography variant="h6">Select Quantity</Typography>
          <TextField
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1))
              )
            }
            inputProps={{ min: 1, max: product.stock }}
            sx={{ width: 120, input: { textAlign: "center" } }}
          />
          <Button onClick={handleAddToCart} variant="contained">Confirm & Add</Button>
        </Box>
      </Dialog>
    </Card>
  );
};

export default ProductCard;
