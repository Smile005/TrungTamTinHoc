import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface UserInfo {
  maNhanVien: string;
  tenNhanVien: string;
  chucVu: string;
  ngayVaoLam: string; // ISO Date format
  gioiTinh: string;
  ngaySinh: string; // ISO Date format
  sdt: string;
  email: string;
  diaChi: string;
  trangThai: string;
  ghiChu?: string; // Optional field
  phanQuyen:number;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  data: any[];  
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userInfo: null,
  data: [],  
  loading: false,
  error: null,
};

export const fetchData = createAsyncThunk('auth/fetchData', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/data');  
    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue((error as Error).message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; userInfo: UserInfo }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;

      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null;

      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
