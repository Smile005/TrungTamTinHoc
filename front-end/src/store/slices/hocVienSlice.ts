import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { HocVienType } from '../../types/HocVienType';

interface HocVienState {
  data: HocVienType[];
  loading: boolean;
  error: string | null;
}

const initialState: HocVienState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchHocVienData = createAsyncThunk('hocvien/fetchData', async () => {
  const response = await axios.get('http://localhost:8081/api/hocvien/ds-hocvien', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
});

const hocVienSlice = createSlice({
  name: 'hocvien',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHocVienData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHocVienData.fulfilled, (state, action: PayloadAction<HocVienType[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHocVienData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default hocVienSlice.reducer;
