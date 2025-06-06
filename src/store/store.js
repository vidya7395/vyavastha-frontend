import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import transactionReducer from './transactionSlice';
import modalReducer from './modalSlice';
import drawerReducer from './drawerSlice';
// import categoryReducer from './categorySlice';
import { authApi } from '../services/authApi';
import { categoryApi } from '../services/categoryApi';
import { transactionApi } from '../services/transactionApi';
import { reportsApi } from '../services/reportsApi';
import { aiApi } from '../services/aiApi';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, // Add the RTK Query reducer
    [categoryApi.reducerPath]: categoryApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    // Add the RTK Query reducer
    // transaction: transactionReducer,
    modal: modalReducer,
    drawer: drawerReducer,
    ui: uiReducer
    // category: categoryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(categoryApi.middleware)
      .concat(transactionApi.middleware)
      .concat(reportsApi.middleware)
      .concat(aiApi.middleware) // Add RTK Query middleware
});

export const RootState = store.getState(); // Use JavaScript instead of TypeScript
export const AppDispatch = store.dispatch;
