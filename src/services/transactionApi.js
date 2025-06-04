// services/transactionApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/const';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
    }),
    addTransaction: builder.mutation({
      query: (body) => ({
        url: '/transaction',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Transaction']
    })
  })
});

export const {
  useGetTransactionSummaryQuery,
  useGetRecentIncomeQuery,
  useGetRecentExpenseQuery,
  useGetTransactionsExpenseQuery,
  useGetTransactionsIncomeQuery,
  useAddTransactionMutation
} = transactionApi;
