import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getRecentTransactionExpense,
  getRecentTransactionIncome,
  getTransactionExpense,
  getTransactionSummary
} from '../api/transactions';

export const fetchTransactionSummary = createAsyncThunk(
  'transaction/fetchSummary',
  async (month, thunkAPI) => {
    try {
      return await getTransactionSummary(month);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const fetchRecentIncome = createAsyncThunk(
  'transaction/fetchRecentIncome',
  async (_, thunkAPI) => {
    try {
      return await getRecentTransactionIncome();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const fetchRecentExpense = createAsyncThunk(
  'transaction/fetchRecentExpense',
  async (_, thunkAPI) => {
    try {
      return await getRecentTransactionExpense();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
//getTransactionExpense
export const fetchTransactionsExpense = createAsyncThunk(
  'transaction/fetchTransactionsExpense',
  async ({ page, limit }, thunkAPI) => {
    try {
      return await getTransactionExpense({ page, limit });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    summary: null,
    recentIncome: null,
    recentExpense: null,
    loading: false,
    transactionsExpense: [],
    page: 1,
    hasMore: true,
    error: null
  },
  reducers: {
    resetTransactionsExpense: (state) => {
      state.transactionsExpense = [];
      state.page = 1;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchTransactionSummary.rejected, (state) => {
        state.summary = null;
        state.loading = true;
      })
      .addCase(fetchRecentIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.recentIncome = action.payload;
      })
      .addCase(fetchRecentIncome.rejected, (state) => {
        state.recentIncome = null;
        state.loading = false;
      })
      .addCase(fetchRecentExpense.fulfilled, (state, action) => {
        state.recentExpense = action.payload;
      })
      .addCase(fetchRecentExpense.rejected, (state) => {
        state.recentExpense = null;
        state.loading = false;
      })
      .addCase(fetchTransactionsExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionsExpense.fulfilled, (state, action) => {
        state.loading = false;
        const { transactions, page, limit } = action.payload;
        state.transactionsExpense = [
          ...state.transactionsExpense,
          ...transactions
        ];

        state.page = page + 1;

        if (transactions.length < limit) {
          state.hasMore = false;
        }
      })
      .addCase(fetchTransactionsExpense.rejected, (state) => {
        state.transactionsExpense = [];
        state.loading = false;
        state.error = 'Failed to load transactions';
      });
  }
});
export const { resetTransactionsExpense } = transactionSlice.actions;

export default transactionSlice.reducer;
