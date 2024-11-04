import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  username?: string;
  email?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: undefined,
  email: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<{ username: string; email: string }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
      state.username = undefined;
      state.email = undefined;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
