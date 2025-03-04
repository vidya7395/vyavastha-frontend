import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      const { id, contentType } = action.payload;
      console.log('reached here');
      state[id] = {
        isOpen: true,
        contentType
      };
    },
    closeDrawer: (state, action) => {
      const { id } = action.payload;
      delete state[id]; // Close and remove the drawer from the state
    }
  }
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;
