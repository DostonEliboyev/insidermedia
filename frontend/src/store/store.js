import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './slices/newsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    auth: authReducer,
  },
});
