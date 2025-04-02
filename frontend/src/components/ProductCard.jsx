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
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/wishlistSlice";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditProduct from "./EditProduct";

// ✅ Define API base URL
const baseURL = "http://localhost:5000"; // Change to your actual backend URL

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const dispatch = useDispatch();

  // ✅ Get User Role from Local Storage
  const userRole = localStorage.getItem("role") || "user";
  const isAdmin = userRole === "admin";

  // ✅ Handle Undefined Product Case
  if (!product || !product.name) {
    console.error("❌ ProductCard received an undefined product:", product);
    return null;
  }

  // ✅ Manage Component State
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // ✅ Handle Add to Cart
  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert("Not enough stock available!");
      return;
    }
    dispatch(addToCartAsync({ productId: product._id, quantity }));
    setOpen(false);
  };

  // ✅ Construct Media Files List (Images & Video)
  const images = product.images.map(img => `${baseURL}${img}`);
  const video = product.video ? `${baseURL}${product.video}` : null;
  const mediaFiles = [...images, ...(video ? [video] : [])];

  // ✅ Media Slider Controls
  const nextMedia = () => setCurrentMediaIndex((prev) => (prev + 1) % mediaFiles.length);
  const prevMedia = () => setCurrentMediaIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);

  // ✅ Handle WhatsApp Inquiry
  const handleInquiry = () => {
    const whatsappNumber = "+919664851087"; // Change to your WhatsApp number
    const message = `Hello, I'm interested in "${product.name}".\n\nPrice: $${product.price}\n\nCan you provide more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // ✅ Wishlist Handling
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const isInWishlist = wishlist.some(item => item.productId._id === product._id);
  const user = useSelector((state) => state.auth.user)
  const handleWishlist = () => {
    if (!user?._id) {
      alert("You need to be logged in to add to wishlist");
      return;
    }
    isInWishlist ? dispatch(removeFromWishlist(product._id)) : dispatch(addToWishlist({ productId: product._id,userId: user._id }));
    ;
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
      {/* Wishlist Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton  onClick={handleWishlist} sx={{ color: isInWishlist ? "red" : "gray" }}>
          {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* Media Slider (Images & Video) */}
      {mediaFiles.length > 0 ? (
        <Box sx={{ position: "relative", width: "100%", height: "220px", bgcolor: "var(--gray)", borderRadius: "12px 12px 0 0" }}>
          {mediaFiles[currentMediaIndex].endsWith(".mp4") ? (
            <video width="100%" height="100%" controls style={{ borderRadius: "12px 12px 0 0", objectFit: "cover" }}>
              <source src={mediaFiles[currentMediaIndex]} type="video/mp4" />
            </video>
          ) : (
            <img src={mediaFiles[currentMediaIndex]} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px 12px 0 0" }} />
          )}

          {/* Slider Controls */}
          {mediaFiles.length > 1 && (
            <>
              <IconButton onClick={prevMedia} sx={{ position: "absolute", left: "10px", color: "white", bgcolor: "rgba(0,0,0,0.4)", "&:hover": { bgcolor: "rgba(0,0,0,0.6)" } }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton onClick={nextMedia} sx={{ position: "absolute", right: "10px", color: "white", bgcolor: "rgba(0,0,0,0.4)", "&:hover": { bgcolor: "rgba(0,0,0,0.6)" } }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </Box>
      ) : (
        <img src="/placeholder.jpg" alt="Placeholder" style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "12px 12px 0 0" }} />
      )}

      {/* Product Details */}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "var(--primary-color)", textAlign: "center" }}>{product.name}</Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "var(--nandor)" }}>Category: {product.category?.name || "N/A"}</Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "var(--nandor)" }}>Price: ${product.price}</Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "var(--nandor)" }}>Stock: {product.stock}</Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <Button onClick={() => setOpen(true)} sx={{ bgcolor: "var(--primary-color)", color: "var(--white)", fontWeight: "bold", "&:hover": { bgcolor: "var(--sea-nymph)" } }}>Add to Cart</Button>
          <Button onClick={handleInquiry} sx={{ bgcolor: "var(--primary-color)", color: "var(--white)", fontWeight: "bold", "&:hover": { bgcolor: "var(--sea-nymph)" } }}>Inquiry on WhatsApp</Button>
        </Box>

        {/* Admin Actions */}
        {isAdmin && (
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button variant="contained" sx={{ bgcolor: "red", color: "white" }} onClick={() => onDelete(product._id)}>Delete</Button>
            <EditProduct product={product} onUpdate={onUpdate} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
