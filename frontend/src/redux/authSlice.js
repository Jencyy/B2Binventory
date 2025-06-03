import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Load user from localStorage
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "null" ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  users: [],
  loading: false,
  error: null,
};

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", credentials);
      if (!data.token) {
        return rejectWithValue("No token received!");
      }
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return { user: data, token: data.token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed!");
    }
  }
);

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async ({ userId, newRole }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `http://localhost:5000/api/auth/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // NOT response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update role");
    }
  }
); 
// Inside authSlice.js

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);


// Logout User
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        state.loading = false;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
