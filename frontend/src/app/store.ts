// Redux store setup
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authReducer } from "../features/auth/authSlice";
import { cartReducer } from "../features/cart/cartSlice";
import { productApi } from "../features/product/productApi";
import { orderApi } from "../features/order/orderApi";
import { adminApi } from "../features/admin/adminApi";
import { adminProductApi } from "../features/admin/adminProductApi";
import {reviewApi} from "../features/review/reviewApi"
import { authApi } from "../features/auth/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [adminProductApi.reducerPath]: adminProductApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      adminApi.middleware,
      adminProductApi.middleware,
      reviewApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
