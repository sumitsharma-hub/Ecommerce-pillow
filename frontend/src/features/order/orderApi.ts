// Order API
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
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

    getMyOrders: builder.query<any[], void>({
      query: () => "/orders/my",
    }),
    trackGuestOrder: builder.query<any, { email: string; orderNumber: string }>(
      {
        query: ({ email, orderNumber }) =>
          `/orders/track?email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(orderNumber)}`,
      },
    ),
  }),
});

export const {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useGetMyOrdersQuery,
  useLazyTrackGuestOrderQuery
} = orderApi;
