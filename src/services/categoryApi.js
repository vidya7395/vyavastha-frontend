import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include' // ensures cookies are sent with requests
  }),
  tagTypes: ['UsersCategories'],
  endpoints: (builder) => ({
    // ✅ Correct usage for GET request
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['UsersCategories']
    }),

    addCategory: builder.mutation({
      query: (categoryValue) => ({
        url: '/categories',
        method: 'POST',
        body: { name: categoryValue }
      }),
      invalidatesTags: ['UsersCategories'] // will auto refetch getCategories
    })
  })
});

// ✅ Use `useGetCategoriesQuery` now
export const { useAddCategoryMutation, useGetCategoriesQuery } = categoryApi;
