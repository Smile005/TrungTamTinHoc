// src/store/slices/taiKhoanSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TaiKhoanType } from '../../types/TaiKhoanType';

interface TaiKhoanState {
  data: TaiKhoanType[];
  loading: boolean;
  error: string | null;
}

const initialState: TaiKhoanState = {
  data: [],
  loading: false,
  error: null,
};

// Thunk để lấy danh sách tài khoản
export const fetchTaiKhoanData = createAsyncThunk('taiKhoan/fetchData', async () => {
  const response = await axios.get('http://localhost:8081/api/auth/ds-taikhoan', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
});

const taiKhoanSlice = createSlice({
  name: 'taiKhoan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaiKhoanData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaiKhoanData.fulfilled, (state, action: PayloadAction<TaiKhoanType[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTaiKhoanData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default taiKhoanSlice.reducer;
