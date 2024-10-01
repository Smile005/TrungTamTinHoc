// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  maNhanVien: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; userInfo: UserInfo }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo; // Lưu thông tin người dùng vào state
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null; // Xóa thông tin người dùng khi đăng xuất
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
