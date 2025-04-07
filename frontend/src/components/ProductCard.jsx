import { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Button, Dialog, Box, IconButton, TextField
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../redux/cartSlice";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditProduct from "./EditProduct";

const baseURL = "http://localhost:5000";

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  if (!product?.name) return null;

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const mediaFiles = [
    ...product.images.map(img => `${baseURL}${img}`),
    ...(product.video ? [`${baseURL}${product.video}`] : [])
  ];
  
  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  const handleWishlist = () => {
    if (!user?.id) return alert("You need to be logged in to add to wishlist");
    dispatch(isInWishlist ? removeFromWishlist(product._id) : addToWishlist({ productId: product._id, userId: user.id }));
  };

  const handleInquiry = () => {
    const message = `Hello, I'm interested in "${product.name}". Can you provide more details?`;
    window.open(`https://wa.me/+919664851087?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleAddToCart = () => {
    if (quantity < 1) return alert("Quantity must be at least 1.");
    if (quantity > product.stock) return alert("Not enough stock available!");

    dispatch(addToCartAsync({ productId: product._id, quantity }));
    setOpen(false);
  };

  const isInWishlist = wishlist.some(item => item.productId === product._id);

  return (
   // ⬇️ Only UI changes done below, no method or logic change
<Card
  sx={{
    maxWidth: 360,
    borderRadius: 3,
    bgcolor: "var(--white)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.03)",
    },
    overflow: "hidden",
    position: "relative",
  }}
>
  <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
    <IconButton
      onClick={handleWishlist}
      sx={{
        color: isInWishlist ? "red" : "var(--gray)",
        bgcolor: "#ffffffcc",
        backdropFilter: "blur(4px)",
        "&:hover": {
          bgcolor: "#ffffffee",
        },
      }}
    >
      {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  </Box>

  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: 220,
      bgcolor: "var(--gray)",
    }}
  >
    {mediaFiles.length > 0 ? (
      mediaFiles[currentMediaIndex].endsWith(".mp4") ? (
        <video
          width="100%"
          height="100%"
          controls
          style={{
            objectFit: "cover",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <source src={mediaFiles[currentMediaIndex]} type="video/mp4" />
        </video>
      ) : (
        <img
          src={mediaFiles[currentMediaIndex]}
          alt="Product"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )
    ) : (
      <img
        src="/placeholder.jpg"
        alt="Placeholder"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    )}

    {mediaFiles.length > 1 && (
      <>
        <IconButton
          onClick={() =>
            setCurrentMediaIndex(
              (prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length
            )
          }
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            color: "white",
            bgcolor: "rgba(0,0,0,0.3)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton
          onClick={() =>
            setCurrentMediaIndex((prev) => (prev + 1) % mediaFiles.length)
          }
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            color: "white",
            bgcolor: "rgba(0,0,0,0.3)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </>
    )}
  </Box>

  <CardContent sx={{ px: 2.5, py: 3 }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: "var(--primary-color)",
        textAlign: "center",
      }}
    >
      {product.name}
    </Typography>

    <Typography
      variant="body2"
      sx={{ textAlign: "center", color: "var(--nandor)", mt: 0.5 }}
    >
      Category: {product.category?.name || "N/A"}
    </Typography>

    <Typography
      variant="body2"
      sx={{ textAlign: "center", color: "var(--nandor)", mb: 1 }}
    >
      Stock: {product.stock}
    </Typography>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
      <Button
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 2,
          fontWeight: "bold",
          bgcolor: "var(--primary-color)",
          color: "var(--white)",
          "&:hover": {
            bgcolor: "var(--sea-nymph)",
          },
        }}
      >
        Add to Cart
      </Button>
      <Button
        onClick={handleInquiry}
        sx={{
          borderRadius: 2,
          fontWeight: "bold",
          bgcolor: "var(--primary-color)",
          color: "var(--white)",
          "&:hover": {
            bgcolor: "var(--sea-nymph)",
          },
        }}
      >
        Inquiry on WhatsApp
      </Button>
    </Box>

    {isAdmin && (
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "red",
            color: "white",
            borderRadius: 2,
            "&:hover": { bgcolor: "#d32f2f" },
          }}
          onClick={() => onDelete(product._id)}
        >
          Delete
        </Button>
        <EditProduct product={product} onUpdate={onUpdate} />
      </Box>
    )}
  </CardContent>

  {/* Dialog */}
  <Dialog open={open} onClose={() => setOpen(false)}>
    <Box
      sx={{
        px: 4,
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        bgcolor: "var(--white)",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: "var(--primary-color)" }}>
        Select Quantity
      </Typography>

      <TextField
        type="number"
        value={quantity}
        onChange={(e) =>
          setQuantity(
            Math.max(
              1,
              Math.min(product.stock, parseInt(e.target.value) || 1)
            )
          )
        }
        inputProps={{ min: 1, max: product.stock }}
        sx={{ width: 120, input: { textAlign: "center" } }}
      />

      <Button
        onClick={handleAddToCart}
        sx={{
          mt: 1,
          px: 4,
          borderRadius: 2,
          fontWeight: "bold",
          bgcolor: "var(--primary-color)",
          color: "var(--white)",
          "&:hover": {
            bgcolor: "var(--sea-nymph)",
          },
        }}
      >
        Confirm & Add to Cart
      </Button>
    </Box>
  </Dialog>
</Card>

  );
};

export default ProductCard;
