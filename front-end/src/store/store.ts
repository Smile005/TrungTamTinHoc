import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import reducer từ slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Thêm auth reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
