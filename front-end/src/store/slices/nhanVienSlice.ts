import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { NhanVienType } from '../../types/NhanVienType';

interface NhanVienState {
  data: NhanVienType[];
  loading: boolean;
  error: string | null;
}

const initialState: NhanVienState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchNhanVienData = createAsyncThunk('nhanvien/fetchData', async () => {
  const response = await axios.get('http://localhost:8081/api/nhanvien/ds-nhanvien', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
});

const nhanVienSlice = createSlice({
  name: 'nhanvien',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNhanVienData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNhanVienData.fulfilled, (state, action: PayloadAction<NhanVienType[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNhanVienData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default nhanVienSlice.reducer;
