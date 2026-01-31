import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminProductApi = createApi({
  reducerPath: "adminProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<any[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<void, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = adminProductApi;
