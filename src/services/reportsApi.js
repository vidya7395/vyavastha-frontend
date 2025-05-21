import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include' // ensures cookies are sent with requests
  }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    // ✅ Correct usage for GET request
    getReportsCategory: builder.query({
      query: (month) => `/expenses-category/report?month=${month}`,
      providesTags: ['Reports']
    })
  })
});

// ✅ Use `useGetCategoriesQuery` now
export const { useGetReportsCategoryQuery } = reportsApi;
