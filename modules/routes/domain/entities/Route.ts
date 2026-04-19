export type RouteStatus = "Activa" | "Inactiva";

export interface Route {
  id: string;
  unitNumber: string;
  route: string;
  status: RouteStatus;
  price: number;
  originAddress?: string;
  originLatitude?: number;
  originLongitude?: number;
  destinationAddress?: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  createdAt: Date;
}