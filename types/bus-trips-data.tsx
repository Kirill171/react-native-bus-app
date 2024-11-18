import BusTripData from '@/types/bus-trip-data';

export default interface BusTripsData {
  [key: number]: BusTripData;
  length: number;
}