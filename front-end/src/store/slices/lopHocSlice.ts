import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LopHocType } from '../../types/LopHocType';

interface LopHocState {
  data: LopHocType[];
  loading: boolean;
  error: string | null;
}

const initialState: LopHocState = {
  data: [],
  loading: false,
  error: null,
};

// Thunk để fetch dữ liệu lớp học, chỉ gọi API nếu dữ liệu trong store trống
export const fetchLopHoc = createAsyncThunk(
  'lopHoc/fetchLopHoc',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { lopHoc: LopHocState };
    
    // Nếu dữ liệu đã có, không cần gọi lại API
    if (state.lopHoc.data.length > 0) {
      return state.lopHoc.data;
    }

    try {
      const response = await axios.get('http://localhost:8081/api/lophoc/ds-lophoc', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const lopHocSlice = createSlice({
  name: 'lopHoc',
  initialState,
  reducers: {
    addLopHoc: (state, action) => {
      state.data.push(action.payload);
    },
    updateLopHoc: (state, action) => {
      const index = state.data.findIndex(lop => lop.maLopHoc === action.payload.maLopHoc);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteLopHoc: (state, action) => {
      state.data = state.data.filter(lop => lop.maLopHoc !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLopHoc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLopHoc.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchLopHoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addLopHoc, updateLopHoc, deleteLopHoc } = lopHocSlice.actions;

export default lopHocSlice.reducer;
