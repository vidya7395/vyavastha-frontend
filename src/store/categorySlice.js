import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addCategory, getCategory } from '../api/category';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    async () => {
      try {
        return await getCategory();
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    };
  }
);
export const addCategories = createAsyncThunk(
  'categories/addCategories',
  async ({ categoryValue }, thunkAPI) => {
    async () => {
      try {
        return await addCategory(categoryValue);
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    };
  }
);
const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: []
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.transactionsExpense = [];
        state.loading = false;
        state.error = 'Failed to load categories';
      })
      //   new
      .addCase(addCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategories.fulfilled, (state, action) => {
        state.loading = false;
        const category = action.payload;
        const newCategory = {
          category,
          _id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`
        };
        state.categories = [...state.categories, newCategory];
      })
      .addCase(addCategories.rejected, (state) => {
        state.categories = [];
        state.loading = false;
        state.error = 'Failed to add Category';
      });
  }
});

export default categorySlice.reducer;
