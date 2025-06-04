import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/const';

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
    }),
    getParseTransactions: builder.mutation({
      query: (text) => ({
        url: '/ai/parse-transactions',
        method: 'POST',
        body: { text }
      }),
      invalidatesTags: ['aiResponse']
    })
  })
});

// ✅ Use `useGetCategoriesQuery` now
export const {
  useGetSpendingInsightMutation,
  useGetParseTransactionsMutation
} = aiApi;
