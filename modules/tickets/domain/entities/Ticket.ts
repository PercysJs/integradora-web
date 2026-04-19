export interface Ticket {
  id: string;
  folio: string;
  passengerName: string;
  routeId: string;
  unitNumber: string;
  routeName: string;
  originAddress: string;
  destinationAddress: string;
  departureTime: string;
  price: number;
  createdAt: Date;
}