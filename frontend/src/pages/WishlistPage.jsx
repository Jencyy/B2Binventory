import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../redux/wishlistSlice"; // thunk action
import { Card, CardContent, Typography, Grid } from "@mui/material";

const WishlistPage = () => {
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.items);
  const userId = useSelector((state) => state.auth.user?._id); // update this based on your state

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        My Wishlist
      </Typography>

      <Grid container spacing={2}>
        {wishlist.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.productId.productName}</Typography>
                <Typography>Price: ₹{item.productId.price}</Typography>
                <Typography>Category: {item.productId.category}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default WishlistPage;
