import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

// ✅ Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error fetching wishlist" });
    }
  }
);

// ✅ Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ productId, userId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;

      console.log("Sending to backend:", { productId, userId });

      const response = await axios.post(
        API_URL,
        { productId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Add to wishlist error:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: "Error adding to wishlist" });
    }
  }
);


// ✅ Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;

      await axios.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Error removing from wishlist" });
    }
  }
);

// ✅ Wishlist Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📦 Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.error = action.payload || "Error fetching wishlist";
        state.loading = false;
      })

      // ❤️ Add to Wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const item = action.payload?.wishlistItem || action.payload;
        const exists = state.wishlist.find(
          (i) => i.productId === item.productId || i.productId?._id === item.productId
        );
        if (!exists) {
          state.wishlist.push(item);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload || "Failed to add to wishlist";
      })

      // 💔 Remove from Wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter((item) => {
          const id = typeof item.productId === "string" ? item.productId : item.productId?._id;
          return id !== action.payload;
        });
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove from wishlist";
      });
  },
});

export default wishlistSlice.reducer;
