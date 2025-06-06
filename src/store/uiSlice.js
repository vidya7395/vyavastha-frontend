import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editingTransactionId: null // store the ID of the transaction being edited
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openEditTransaction: (state, action) => {
      state.editingTransactionId = action.payload; // set ID of transaction
    },
    closeEditTransaction: (state) => {
      state.editingTransactionId = null;
    }
  }
});

export const { openEditTransaction, closeEditTransaction } = uiSlice.actions;
export default uiSlice.reducer;
