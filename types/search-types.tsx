import BusTripData from '@/types/bus-trip-data';
import Attributes from '@/types/attributes'

export default interface SearchState {
  fromCity: string;
  toCity: string;
  date: string;
  passengers: number;
  busTripsData: BusTripData[] | null;
  busTripData: Attributes | null;
  busTripId: string;
}