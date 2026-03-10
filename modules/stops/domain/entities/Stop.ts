export interface Stop {
  id: string;
  name: string;
  routeId: string;
  routeName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}