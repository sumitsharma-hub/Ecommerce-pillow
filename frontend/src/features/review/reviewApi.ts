import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getReviews: builder.query<any[], number>({
      query: (productId) => `/reviews/${productId}`,
      providesTags: ["Reviews"],
    }),

    addReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `/reviews/${productId}`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: ["Reviews"],
    }),
    updateReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `/reviews/edit/${id}`,
        method: "PUT",
        body: { rating, comment },
      }),
      invalidatesTags: ["Reviews"],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
    canReview: builder.query<{ canReview: boolean }, number>({
      query: (productId) => `/reviews/can-review/${productId}`,
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useCanReviewQuery
} = reviewApi;
