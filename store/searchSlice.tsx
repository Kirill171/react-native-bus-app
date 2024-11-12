import { createSlice } from '@reduxjs/toolkit';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const initialState = {
  fromCity: '',
  toCity: '',
  date: formatDate(new Date()),
  passengers: 1,
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
      state.date = formatDate(action.payload);
    },
    setPassengers: (state, action) => {
      state.passengers = action.payload;
    },
  },
});

export const { setFromCity, setToCity, setDate, setPassengers } = searchSlice.actions;
export default searchSlice.reducer;
