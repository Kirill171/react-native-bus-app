import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import searchReducer from '@/store/searchSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
