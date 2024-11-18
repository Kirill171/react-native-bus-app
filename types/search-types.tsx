import BusTripData from '@/types/bus-trip-data';

export default interface SearchState {
  fromCity: string;
  toCity: string;
  date: string;
  passengers: number;
  busTripsData: BusTripData[] | null;
}