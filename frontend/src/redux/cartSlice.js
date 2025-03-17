import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

// ✅ Fetch Cart from Backend on Page Load
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.items; // Ensure backend sends an array of items
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch cart");
  }
});

// ✅ Add Product to Cart (Stores in DB)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/add`, { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } });

      // ✅ Immediately fetch the updated cart
      dispatch(fetchCart());
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// ✅ Update Cart Quantity in DB
export const updateCartQuantityAsync = createAsyncThunk("cart/updateCartQuantityAsync", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/update`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.items;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

// ✅ Remove Product from Cart (In DB)
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return productId; // Return the productId to update state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter((item) => item.productId._id !== action.payload);
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        // ✅ The fetchCart() action will update state, so nothing is needed here
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
