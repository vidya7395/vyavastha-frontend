import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include'
  }),
  tagTypes: ['aiResponse'],
  endpoints: (builder) => ({
    getSpendingInsight: builder.mutation({
      query: (topSpends) => ({
        url: '/ai/top-six-expense',
        method: 'POST',
        body: { topSpends }
      })
    })
  })
});

// ✅ Use `useGetCategoriesQuery` now
export const { useGetSpendingInsightMutation } = aiApi;
