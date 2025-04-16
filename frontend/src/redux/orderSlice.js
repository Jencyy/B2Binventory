// src/redux/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const placeOrderAsync = createAsyncThunk(
  "order/placeOrder",
  async ({ productId, quantity, address, paymentMethod }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/orders/place",
        { productId, quantity, address, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    placing: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.placing = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderAsync.pending, (state) => {
        state.placing = true;
        state.success = false;
        state.error = null;
      })
      .addCase(placeOrderAsync.fulfilled, (state) => {
        state.placing = false;
        state.success = true;
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.placing = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
