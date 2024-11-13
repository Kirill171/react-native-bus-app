import { createSlice } from '@reduxjs/toolkit';
import SearchState from '@/types/search-types';

const initialState: SearchState = {
  fromCity: '',
  toCity: '',
  date: new Date().toISOString(),
  passengers: 1,
  flightsData: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFromCity: (state, action) => {
      state.fromCity = action.payload;
    },
    setToCity: (state, action) => {
      state.toCity = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setPassengers: (state, action) => {
      state.passengers = action.payload;
    },
    setFlightData: (state, action) => {
      state.flightsData = action.payload;
    },
  },
});

export const { setFromCity, setToCity, setDate, setPassengers, setFlightData } = searchSlice.actions;
export default searchSlice.reducer;
