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
  improveFromCity: '',
  improveToCity: '',
  departureTime: Date.now(),
  arrivalTime: Date.now()
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
    setImproveFromCity: (state, action) => {
      state.improveFromCity = action.payload;
    },
    setImproveToCity: (state, action) => {
      state.improveToCity = action.payload;
    },
    setDepartureTime: (state, action) => {
      state.departureTime = action.payload;
    },
    setArrivalTime: (state, action) => {
      state.arrivalTime = action.payload;
    }
  }
});

export const {
  setFromCity,
  setToCity,
  setDate,
  setPassengers,
  setBusTripsData,
  setBusTripData,
  setBusTripId,
  setImproveFromCity,
  setImproveToCity,
  setArrivalTime,
  setDepartureTime
} = searchSlice.actions;

export default searchSlice.reducer;
