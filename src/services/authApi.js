import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include' // Important! Ensures cookies are sent with requests
  }),
  tagTypes: ['User'], // Helps with caching
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['User'] // Clears cache to refresh user data
    }),
    getUser: builder.query({
      query: () => '/auth/user',
      providesTags: ['User'] // Caches user data
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      invalidatesTags: ['User'] // Clears cache on logout
    })
  })
});

export const { useLoginMutation, useGetUserQuery, useLogoutMutation } = authApi;
