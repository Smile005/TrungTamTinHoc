import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import auth reducer
import nhanVienReducer from './slices/nhanVienSlice'; // Import nhanVien reducer
import hocVienReducer from './slices/hocVienSlice'; // Import hocVien reducer
import taiKhoanReducer from './slices/taiKhoanSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Thêm auth reducer
    nhanvien: nhanVienReducer, // Thêm nhanVien reducer
    hocvien: hocVienReducer, // Thêm hocVien reducer
    taikhoan: taiKhoanReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
