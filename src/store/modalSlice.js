import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { modalType: null, modalProps: {} }, // Store modal type + dynamic props
  reducers: {
    openModal: (state, action) => {
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps || {}; // Pass any props (optional)
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalProps = {};
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
