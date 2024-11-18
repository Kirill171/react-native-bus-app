import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '@/store';
import AuthState from '@/types/auth-types';

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
      AsyncStorage.setItem('auth', JSON.stringify(state));
    },
    logOut: (state) => {
      state.isAuthenticated = false;
      state.username = undefined;
      state.email = undefined;
      AsyncStorage.removeItem('auth');
    },
    setAuthState: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { logIn, logOut, setAuthState } = authSlice.actions;
export default authSlice.reducer;

export const loadAuthState = () => async (dispatch: AppDispatch) => {
  const savedAuthState = await AsyncStorage.getItem('auth');
  if (savedAuthState) {
    dispatch(setAuthState(JSON.parse(savedAuthState)));
  }
};
