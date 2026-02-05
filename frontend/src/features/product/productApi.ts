// Product API
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  productCode: string;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
    }),
    getProductByCode: builder.query<any, string>({
      query: (productCode) => `/products/${productCode}`,
    }),
  }),
});

export const { useGetProductsQuery,useGetProductByCodeQuery } = productApi;
