import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks for API calls
export const fetchLowStock = createAsyncThunk(
  "adminDashboard/fetchLowStock",
  async () => {
    const response = await axios.get("/api/products/out-of-stock");
    return response.data;
  }
);

export const fetchLogins = createAsyncThunk(
  "adminDashboard/fetchLogins",
  async () => {
    const response = await axios.get("/api/auth/recent-logins");
    console.log("API Response for recent logins:", response.data); // Debug Log
    return response.data;
  }
);

export const fetchActivities = createAsyncThunk(
  "adminDashboard/fetchActivities",
  async () => {
    const response = await axios.get("/api/auth/activities");
    return response.data;
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    lowStockProducts: [],
    recentLogins: [],
    recentActivities: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLowStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.lowStockProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchLogins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogins.fulfilled, (state, action) => {
        console.log("Fetched logins:", action.payload); // Debug Log
        state.recentLogins = action.payload;
        state.loading = false;
      })
      .addCase(fetchLogins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.recentActivities = action.payload;
        state.loading = false;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminDashboardSlice.reducer;
