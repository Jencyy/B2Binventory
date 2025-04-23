import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import authReducer from "./authSlice";
import orderReducer from "./orderSlice";
import adminDashboardReducer from "./adminDashboardSlice"

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    auth: authReducer,
    adminDashboard: adminDashboardReducer,
  
  },
});

export default store;
