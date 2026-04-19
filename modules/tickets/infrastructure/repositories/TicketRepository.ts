import { supabase } from "@/shared/lib/supabase";
import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { Ticket } from "../../domain/entities/Ticket";

export class TicketRepository implements ITicketRepository {
  async findAll(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findByUnitNumber(unitNumber: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("unit_number", unitNumber)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapToEntity);
  }

  async create(input: Omit<Ticket, "id" | "createdAt">): Promise<Ticket> {
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        folio: input.folio,
        passenger_name: input.passengerName,
        route_id: input.routeId,
        unit_number: input.unitNumber,
        departure_time: input.departureTime,
        price: input.price,
        route_name: input.routeName,
        origin_address: input.originAddress,
        destination_address: input.destinationAddress,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  private mapToEntity(data: Record<string, unknown>): Ticket {
    return {
      id: data.id as string,
      folio: data.folio as string,
      passengerName: data.passenger_name as string,
      routeId: data.route_id as string ?? "",
      unitNumber: data.unit_number as string,
      routeName: data.route_name as string ?? "",
      originAddress: data.origin_address as string ?? "",
      destinationAddress: data.destination_address as string ?? "",
      departureTime: data.departure_time as string,
      price: data.price as number,
      createdAt: new Date(data.created_at as string),
    };
  }
}