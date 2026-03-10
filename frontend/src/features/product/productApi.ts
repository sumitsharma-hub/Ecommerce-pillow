// features/product/productApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ProductImage {
  id: number;
  url: string;
  position: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  ingredients?: string;
  price: number;
  mrp?: number;
  imageUrl: string;
  category: string;
  productCode: string;
  images?: ProductImage[];
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

export const { useGetProductsQuery, useGetProductByCodeQuery } = productApi;
