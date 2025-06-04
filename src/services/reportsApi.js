import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/const';

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
