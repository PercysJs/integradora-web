import { supabase } from "@/shared/lib/supabase";
import { IScheduleRepository } from "../../domain/repositories/IScheduleRepository";
import { Schedule } from "../../domain/entities/Schedule";

export class ScheduleRepository implements IScheduleRepository {
  async findAll(): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from("schedules")
      .select("*, routes(unit_number, route)")
      .order("time", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Schedule | null> {
    const { data, error } = await supabase
      .from("schedules")
      .select("*, routes(unit_number, route)")
      .eq("id", id)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findByRoute(routeId: string): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from("schedules")
      .select("*, routes(unit_number, route)")
      .eq("route_id", routeId);

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async findByTimeAndRoute(time: string, routeId: string): Promise<Schedule | null> {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("time", time)
      .eq("route_id", routeId)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async create(input: Omit<Schedule, "id" | "createdAt" | "routeName">): Promise<Schedule> {
    const { data, error } = await supabase
      .from("schedules")
      .insert({
        time: input.time,
        route_id: input.routeId,
      })
      .select("*, routes(unit_number, route)")
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async update(id: string, input: Partial<Omit<Schedule, "id" | "createdAt" | "routeName">>): Promise<Schedule> {
    const { data, error } = await supabase
      .from("schedules")
      .update({
        ...(input.time && { time: input.time }),
        ...(input.routeId && { route_id: input.routeId }),
      })
      .eq("id", id)
      .select("*, routes(unit_number, route)")
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  private mapToEntity(data: any): Schedule {
    return {
      id: data.id,
      time: data.time,
      routeId: data.route_id,
      routeName: data.routes
        ? `Unidad ${data.routes.unit_number} - ${data.routes.route}`
        : "",
      createdAt: new Date(data.created_at),
    };
  }
}