import React, { useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Grid,
  IconButton, Button, Stack, Skeleton
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { addToCartAsync } from "../redux/cartSlice";
import { motion } from "framer-motion";

const baseURL = "http://localhost:5000";
const categoryMap = {
  "67f4d559fe5b35266832fee8": "Skincare",
  // Add more as needed
};
const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist) || [];
  const loading = useSelector((state) => state.wishlist.status) === "loading";

  useEffect(() => {
    dispatch(fetchWishlist());
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
  };

  return (
    <Box sx={{ px: 3, py: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#000" }}>
        My Wishlist
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
              <Skeleton width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : wishlist.length === 0 ? (
        <Typography variant="body1" sx={{ color: "gray", mt: 5 }}>
          Your wishlist is currently empty.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item) => {
            const product = item.productId;
            const image = product.images?.[0]
              ? `${baseURL}${product.images[0]}`
              : "/placeholder.jpg";

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      bgcolor: "#f9f9f9",
                      color: "#000",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": { transform: "scale(1.015)" },
                      transition: "0.3s",
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={product.name}
                      sx={{
                        height: 180,
                        width: "100%",
                      objectFit: "cover",
                       
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />

                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "red",
                        bgcolor: "transparent",
                        "&:hover": { bgcolor: "#eee" },
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>

                    <CardContent>
                      <Typography variant="h6" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        ₹{product.price} — {categoryMap[product.category] || "N/A"}
                      </Typography>

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToCart(product)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            color: "#000",
                            borderColor: "#000",
                            "&:hover": {
                              bgcolor: "#000",
                              color: "#fff",
                              borderColor: "#000",
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default WishlistPage;

