import { supabase } from "@/shared/lib/supabase";
import { IRouteRepository } from "../../domain/repositories/IRouteRepository";
import { Route } from "../../domain/entities/Route";

export class RouteRepository implements IRouteRepository {
  async findAll(): Promise<Route[]> {
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Route | null> {
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findByUnitNumber(unitNumber: string): Promise<Route | null> {
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .ilike("unit_number", unitNumber)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async create(input: Omit<Route, "id" | "createdAt">): Promise<Route> {
    const { data, error } = await supabase
      .from("routes")
      .insert({
        unit_number: input.unitNumber,
        route: input.route,
        status: input.status,
        price: input.price,
        origin_address: input.originAddress,
        origin_latitude: input.originLatitude,
        origin_longitude: input.originLongitude,
        destination_address: input.destinationAddress,
        destination_latitude: input.destinationLatitude,
        destination_longitude: input.destinationLongitude,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async update(id: string, input: Partial<Omit<Route, "id" | "createdAt">>): Promise<Route> {
    const { data, error } = await supabase
      .from("routes")
      .update({
        ...(input.unitNumber && { unit_number: input.unitNumber }),
        ...(input.route && { route: input.route }),
        ...(input.status && { status: input.status }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.originAddress && { origin_address: input.originAddress }),
        ...(input.originLatitude && { origin_latitude: input.originLatitude }),
        ...(input.originLongitude && { origin_longitude: input.originLongitude }),
        ...(input.destinationAddress && { destination_address: input.destinationAddress }),
        ...(input.destinationLatitude && { destination_latitude: input.destinationLatitude }),
        ...(input.destinationLongitude && { destination_longitude: input.destinationLongitude }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("routes")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToEntity(data: any): Route {
    return {
      id: data.id,
      unitNumber: data.unit_number,
      route: data.route,
      status: data.status,
      price: data.price ?? 0,
      originAddress: data.origin_address,
      originLatitude: data.origin_latitude,
      originLongitude: data.origin_longitude,
      destinationAddress: data.destination_address,
      destinationLatitude: data.destination_latitude,
      destinationLongitude: data.destination_longitude,
      createdAt: new Date(data.created_at),
    };
  }
}