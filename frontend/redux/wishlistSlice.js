import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

// ✅ Fetch Wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, { withCredentials: true });
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// ✅ Add to Wishlist
export const addToWishlist = createAsyncThunk(
    "wishlist/add",
    async ({ productId, userId }, { rejectWithValue }) => { // ✅ Accept userId
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          return rejectWithValue("No authentication token found");
        }
  
        console.log("Sending request with productId:", productId, "and userId:", userId); // ✅ Debug Log
  
        const response = await fetch("http://localhost:5000/api/wishlist/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, userId }), // ✅ Send both productId and userId
        });
  
        const data = await response.json();
  
        console.log("Response from API:", data); // ✅ Debug Log
  
        if (!response.ok) {
          throw new Error(data.message || "Failed to add to wishlist");
        }
  
        return data;
      } catch (error) {
        console.error("Error in addToWishlist:", error.message); // ✅ Debug Log
        return rejectWithValue(error.message);
      }
    }
  );
  
  

  
// ✅ Remove from Wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/remove/${productId}`, { withCredentials: true });
    return productId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { wishlist: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(item => item.productId._id !== action.payload);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        console.log("Redux State Updated with:", action.payload); // ✅ Debug Log
        state.wishlist.push({ productId: action.payload });
      })
;      
  },
});

export default wishlistSlice.reducer;
