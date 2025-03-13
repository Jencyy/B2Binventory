import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
  },
});

export default store;
