import { supabase } from "@/shared/lib/supabase";
import { IStopRepository } from "../../domain/repositories/IStopRepository";
import { Stop } from "../../domain/entities/Stop";

export class StopRepository implements IStopRepository {
  async findAll(): Promise<Stop[]> {
    const { data, error } = await supabase
      .from("stops")
      .select("*, routes(unit_number, route)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Stop | null> {
    const { data, error } = await supabase
      .from("stops")
      .select("*, routes(unit_number, route)")
      .eq("id", id)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findByRoute(routeId: string): Promise<Stop[]> {
    const { data, error } = await supabase
      .from("stops")
      .select("*, routes(unit_number, route)")
      .eq("route_id", routeId);

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async findByNameAndRoute(name: string, routeId: string): Promise<Stop | null> {
    const { data, error } = await supabase
      .from("stops")
      .select("*")
      .ilike("name", name)
      .eq("route_id", routeId)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async create(input: Omit<Stop, "id" | "createdAt" | "routeName">): Promise<Stop> {
    const { data, error } = await supabase
      .from("stops")
      .insert({
        name: input.name,
        route_id: input.routeId,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
      })
      .select("*, routes(unit_number, route)")
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async update(id: string, input: Partial<Omit<Stop, "id" | "createdAt" | "routeName">>): Promise<Stop> {
    const { data, error } = await supabase
      .from("stops")
      .update({
        ...(input.name && { name: input.name }),
        ...(input.routeId && { route_id: input.routeId }),
        ...(input.address && { address: input.address }),
        ...(input.latitude && { latitude: input.latitude }),
        ...(input.longitude && { longitude: input.longitude }),
      })
      .eq("id", id)
      .select("*, routes(unit_number, route)")
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("stops")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  private mapToEntity(data: any): Stop {
    return {
      id: data.id,
      name: data.name,
      routeId: data.route_id,
      routeName: data.routes
        ? `Unidad ${data.routes.unit_number} - ${data.routes.route}`
        : "",
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: new Date(data.created_at),
    };
  }
}