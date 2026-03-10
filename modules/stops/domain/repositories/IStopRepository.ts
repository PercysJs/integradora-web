import { Stop } from "../entities/Stop";

export interface IStopRepository {
  findAll(): Promise<Stop[]>;
  findById(id: string): Promise<Stop | null>;
  findByRoute(routeId: string): Promise<Stop[]>;
  findByNameAndRoute(name: string, routeId: string): Promise<Stop | null>;
  create(data: Omit<Stop, "id" | "createdAt" | "routeName">): Promise<Stop>;
  update(id: string, data: Partial<Omit<Stop, "id" | "createdAt" | "routeName">>): Promise<Stop>;
  delete(id: string): Promise<void>;
}