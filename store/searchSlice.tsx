import { createSlice } from '@reduxjs/toolkit';
import SearchState from '@/types/search-types';

const initialState: SearchState = {
  fromCity: '',
  toCity: '',
  date: new Date().toISOString(),
  passengers: 1,
  busTripsData: null,
  busTripData: null,
  busTripId: '',
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
    setBusTripsData: (state, action) => {
      state.busTripsData = action.payload;
    },
    setBusTripData: (state, action) => {
      state.busTripData = action.payload;
    },
    setBusTripId: (state, action) => {
      state.busTripId = action.payload;
    },
  },
});

export const {
  setFromCity,
  setToCity,
  setDate,
  setPassengers,
  setBusTripsData,
  setBusTripData,
  setBusTripId } = searchSlice.actions;

export default searchSlice.reducer;
