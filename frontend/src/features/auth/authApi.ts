import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/auth`,
  }),
  endpoints: (builder) => ({
    // Step 1: Identify user
    identify: builder.mutation({
      query: (data) => ({
        url: "/identify",
        method: "POST",
        body: data,
      }),
    }),

    // Step 2a: Password login
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    // Step 2b: Send OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Step 3: Verify OTP
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Step 4: Create account
    createAccount: builder.mutation({
      query: (data) => ({
        url: "/create-account",
        method: "POST",
        body: data,
      }),
    }),

    // Password reset flow
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetOtp: builder.mutation({
      query: (data) => ({
        url: "/verify-reset-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useIdentifyMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useCreateAccountMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} = authApi;
