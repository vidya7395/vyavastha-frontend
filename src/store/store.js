import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import transactionReducer from './transactionSlice';
import modalReducer from './modalSlice';
import drawerReducer from './drawerSlice';
// import categoryReducer from './categorySlice';
import { authApi } from '../services/authApi';
import { categoryApi } from '../services/categoryApi';
import { transactionApi } from '../services/transactionApi';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, // Add the RTK Query reducer
    [categoryApi.reducerPath]: categoryApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    // Add the RTK Query reducer
    // transaction: transactionReducer,
    modal: modalReducer,
    drawer: drawerReducer
    // category: categoryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(categoryApi.middleware)
      .concat(transactionApi.middleware) // Add RTK Query middleware
});

export const RootState = store.getState(); // Use JavaScript instead of TypeScript
export const AppDispatch = store.dispatch;
