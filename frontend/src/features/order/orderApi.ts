// Order API
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Place order (COD / UPI)
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
    }),

    // ✅ Create Razorpay order
    createRazorpayOrder: builder.mutation({
      query: (data: { orderId: number }) => ({
        url: "/orders/payments/create-order",
        method: "POST",
        body: data,
      }),
    }),

    // ✅ Verify Razorpay payment
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/orders/payments/verify",
        method: "POST",
        body: data,
      }),
    }),

    getMyOrders: builder.query({
      query: () => "/orders/my",
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useGetMyOrdersQuery,
} = orderApi;
