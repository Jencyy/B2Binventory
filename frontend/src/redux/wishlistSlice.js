import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

// ✅ Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }, // Send token
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch wishlist");
    }
  }
);

// ✅ Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ productId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      console.log("Sending request with productId:", productId, "and userId:", userId);

      const response = await fetch("http://localhost:5000/api/wishlist/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, userId }),
      });

      const data = await response.json();

      console.log("Response from API:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to wishlist");
      }

      return data;
    } catch (error) {
      console.error("Error in addToWishlist:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      await axios.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Send token
        withCredentials: true,
      });

      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove from wishlist");
    }
  }
);


// ✅ Wishlist Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { wishlist: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(item => item.productId !== action.payload);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
       
        state.wishlist.push(action.payload.wishlistItem); // ✅ Store `wishlistItem` properly
      });
  },
});

export default wishlistSlice.reducer;
