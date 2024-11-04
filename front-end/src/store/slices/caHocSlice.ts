import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CaHocType } from '../../types/CaHocType';

// Async action to fetch CaHoc data
export const fetchCaHoc = createAsyncThunk('caHoc/fetchCaHoc', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:8081/api/cahoc', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách ca học:', error);
        return rejectWithValue((error as any).response?.data || 'Lỗi không xác định');
    }
});

// Async action to delete a CaHoc
export const deleteCaHoc = createAsyncThunk('caHoc/deleteCaHoc', async (maCa: string, { rejectWithValue, dispatch }) => {
    try {
        await axios.post('http://localhost:8081/api/cahoc/xoa-cahoc', { maCa }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        dispatch(fetchCaHoc()); // Re-fetch data after deletion
        return maCa;
    } catch (error) {
        console.error('Lỗi khi xóa ca học:', error);
        return rejectWithValue((error as any).response?.data || 'Lỗi không xác định');
    }
});

// Slice for CaHoc
const caHocSlice = createSlice({
    name: 'caHoc',
    initialState: {
        data: [] as CaHocType[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCaHoc.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCaHoc.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchCaHoc.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteCaHoc.fulfilled, (state, action) => {
                state.data = state.data.filter((item) => item.maCa !== action.payload);
            })
            .addCase(deleteCaHoc.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default caHocSlice.reducer;
