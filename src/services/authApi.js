import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/const';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
      query: () => '/auth/userDetail',
      providesTags: ['User'] // Caches user data
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      invalidatesTags: ['User'] // Clears cache on logout
    }),
    signup: builder.mutation({
      query: ({ name, emailId, password }) => ({
        url: '/auth/signup',
        method: 'POST',
        body: { name, emailId, password }
      }),
      invalidatesTags: ['User'] // Clears cache on logout
    })
  })
});

export const {
  useLoginMutation,
  useGetUserQuery,
  useLogoutMutation,
  useSignupMutation
} = authApi;
