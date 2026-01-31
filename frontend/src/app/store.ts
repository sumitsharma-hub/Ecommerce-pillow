// Redux store setup
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authReducer } from "../features/auth/authSlice";
import { cartReducer } from "../features/cart/cartSlice";
import { productApi } from "../features/product/productApi";
import { orderApi } from "../features/order/orderApi";
import { adminApi } from "../features/admin/adminApi";
import { adminProductApi } from "../features/admin/adminProductApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [adminProductApi.reducerPath]: adminProductApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      orderApi.middleware,
      adminApi.middleware,
      adminProductApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
