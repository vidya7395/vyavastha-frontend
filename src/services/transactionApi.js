// services/transactionApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include'
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    getTransactionSummary: builder.query({
      query: (month) => `/transaction/summary?month=${month}`,
      providesTags: ['Transaction']
    }),
    getRecentIncome: builder.query({
      query: () => '/transaction/recent-income',
      providesTags: ['Transaction']
    }),
    getRecentExpense: builder.query({
      query: () => '/transaction/recent-expenses',
      providesTags: ['Transaction']
    }),
    getTransactionsExpense: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/transaction/expense?page=${page}&limit=${limit}`,
      providesTags: ['Transaction']
    }),
    getTransactionsIncome: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/transaction/income?page=${page}&limit=${limit}`,
      providesTags: ['Transaction']
    })
  })
});

export const {
  useGetTransactionSummaryQuery,
  useGetRecentIncomeQuery,
  useGetRecentExpenseQuery,
  useGetTransactionsExpenseQuery,
  useGetTransactionsIncomeQuery
} = transactionApi;
