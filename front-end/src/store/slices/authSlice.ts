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
      state.userInfo = action.payload.userInfo;

      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null;

      // Xóa token khỏi localStorage khi đăng xuất
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

