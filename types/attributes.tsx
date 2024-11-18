export default interface Attributes {
  fromCity: string,
  toCity: string,
  date: { iso: string },
  departureTime: { iso: string },
  arrivalTime: { iso: string },
  totalSeats: number,
  remainingSeats: number,
  price: number,
  driverName: string,
  driverPhone: string,
  busNumberPlate: string,
  busBrand: string,
  busColor: string,
}