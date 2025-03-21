import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch categories from the backend
export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await axios.get("http://localhost:5000/api/categories");
  return response.data;
});

// ✅ Add a new category to the backend
export const addCategory = createAsyncThunk("categories/addCategory", async (categoryData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token"); // Get token from localStorage
    const response = await axios.post("http://localhost:5000/api/categories", categoryData, {
      headers: { Authorization: `Bearer ${token}` }, // Pass token for authentication
    });
    return response.data.category; // Return the newly added category
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ✅ Handle adding a category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload); // Add new category to the list
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;

