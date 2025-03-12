import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL
const API_URL = "http://localhost:5000/api/products";

// Fetch Products (Async Action)
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const { data } = await axios.get(API_URL);
  return data;
});

// Delete Product
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

// Update Product
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, updatedData }) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(`${API_URL}/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.updatedProduct;
});

// Product Slice
const productSlice = createSlice({
  name: "products",
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        console.log("Deleted Product ID:", action.payload); // ✅ Debugging log
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;
