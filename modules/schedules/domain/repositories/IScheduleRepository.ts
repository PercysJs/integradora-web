import { Schedule } from "../entities/Schedule";

export interface IScheduleRepository {
  findAll(): Promise<Schedule[]>;
  findById(id: string): Promise<Schedule | null>;
  findByRoute(routeId: string): Promise<Schedule[]>;
  findByTimeAndRoute(time: string, routeId: string): Promise<Schedule | null>;
  create(data: Omit<Schedule, "id" | "createdAt" | "routeName">): Promise<Schedule>;
  update(id: string, data: Partial<Omit<Schedule, "id" | "createdAt" | "routeName">>): Promise<Schedule>;
  delete(id: string): Promise<void>;
}