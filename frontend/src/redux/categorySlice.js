import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch categories
export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await axios.get("http://localhost:5000/api/categories");
  return response.data;
});

// Add category
export const addCategory = createAsyncThunk("categories/addCategory", async (categoryData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:5000/api/categories", categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.category;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update category
export const updateCategory = createAsyncThunk("categories/updateCategory", async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`http://localhost:5000/api/categories/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.category; // Ensure this matches your backend response structure
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
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          // Directly update the category in the state
          state.categories[index] = action.payload;
        }
      })
      
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
