// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import reducer từ slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Chỉ định reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
