import FlightsData from '@/types/flights-data';

export default interface SearchState {
  fromCity: string;
  toCity: string;
  date: string;
  passengers: number;
  flightsData: FlightsData | null;
}