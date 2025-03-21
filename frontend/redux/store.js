import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
  },
});

export default store;
