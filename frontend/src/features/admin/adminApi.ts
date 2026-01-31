import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Orders", "Products"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => "/admin/dashboard",
    }),

    getOrders: builder.query<any[], void>({
      query: () => "/admin/orders",
      providesTags: ["Orders"],
    }),

    updateTracking: builder.mutation({
      query: (data) => ({
        url: "/admin/orders/tracking",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

    downloadSlip: builder.mutation<null, number>({
      queryFn: async (orderId, _api, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `/admin/orders/${orderId}/slip`,
          responseHandler: (response) => response.blob(),
        });

        if (result.error) {
          return { error: result.error };
        }

        const blob = result.data as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `order-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { data: null };
      },
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetOrdersQuery,
  useUpdateTrackingMutation,
  useDownloadSlipMutation,
} = adminApi;
