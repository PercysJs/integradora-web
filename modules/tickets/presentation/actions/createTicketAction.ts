"use server";

import { supabase } from "@/shared/lib/supabase";

export async function createTicketAction(formData: FormData) {
  const passengerName = formData.get("passengerName") as string;
  const routeId = formData.get("routeId") as string;
  const unitNumber = formData.get("unitNumber") as string;
  const departureTime = formData.get("departureTime") as string;
  const price = parseFloat(formData.get("price") as string);

  try {
    // Obtener información de la ruta para guardarla en el boleto
    const { data: routeData } = await supabase
      .from("routes")
      .select("route, origin_address, destination_address")
      .eq("id", routeId)
      .single();

    // Generar folio basado en el último folio registrado
    const { data: lastTicket } = await supabase
      .from("tickets")
      .select("folio")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNumber = 1;
    if (lastTicket?.folio) {
      const lastNumber = parseInt(lastTicket.folio.replace("ABS-", ""));
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const folio = `ABS-${String(nextNumber).padStart(4, "0")}`;

    const { error } = await supabase
      .from("tickets")
      .insert({
        folio,
        passenger_name: passengerName,
        route_id: routeId,
        unit_number: unitNumber,
        departure_time: departureTime,
        price,
        route_name: routeData?.route ?? "",
        origin_address: routeData?.origin_address ?? "",
        destination_address: routeData?.destination_address ?? "",
      });

    if (error) throw new Error(error.message);
    return { success: true, message: "Boleto generado correctamente.", folio };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message, folio: "" };
  }
}