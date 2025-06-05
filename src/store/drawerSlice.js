import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      const { id, contentType } = action.payload;
      state[id] = {
        isOpen: true,
        contentType
      };
    },
    closeDrawer: (state, action) => {
      const { id } = action.payload;
      delete state[id]; // Close and remove the drawer from the state
    },
    drawerSize: (state, action) => {
      const { id, size } = action.payload;
      if (state[id]) {
        state[id].size = size; // Update the size of the drawer
      }
    }
  }
});

export const { openDrawer, closeDrawer, drawerSize } = drawerSlice.actions;

export default drawerSlice.reducer;
