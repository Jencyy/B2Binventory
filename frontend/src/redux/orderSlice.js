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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ NEW: cancelOrderAsync
export const cancelOrderAsync = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { orderId, message: response.data.message };
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
    canceling: false,
    cancelSuccess: false,
    cancelError: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.placing = false;
      state.success = false;
      state.error = null;
      state.canceling = false;
      state.cancelSuccess = false;
      state.cancelError = null;
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
      })

      // ✅ Cancel order handlers
      .addCase(cancelOrderAsync.pending, (state) => {
        state.canceling = true;
        state.cancelSuccess = false;
        state.cancelError = null;
      })
      .addCase(cancelOrderAsync.fulfilled, (state) => {
        state.canceling = false;
        state.cancelSuccess = true;
      })
      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.canceling = false;
        state.cancelError = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
  