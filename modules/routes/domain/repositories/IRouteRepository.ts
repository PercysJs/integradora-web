import { Route } from "../entities/Route";

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByUnitNumber(unitNumber: string): Promise<Route | null>;
  create(data: Omit<Route, "id" | "createdAt">): Promise<Route>;
  update(id: string, data: Partial<Omit<Route, "id" | "createdAt">>): Promise<Route>;
  delete(id: string): Promise<void>;
}