"use server";

import { supabase } from "@/shared/lib/supabase";

export async function createRouteAction(formData: FormData) {
  const unitNumber = formData.get("unitNumber") as string;
  const route = formData.get("route") as string;
  const status = formData.get("status") as "Activa" | "Inactiva";
  const price = parseFloat(formData.get("price") as string);
  const originAddress = formData.get("originAddress") as string;
  const originLatitude = formData.get("originLatitude");
  const originLongitude = formData.get("originLongitude");
  const destinationAddress = formData.get("destinationAddress") as string;
  const destinationLatitude = formData.get("destinationLatitude");
  const destinationLongitude = formData.get("destinationLongitude");

  try {
    const { error } = await supabase
      .from("routes")
      .insert({
        unit_number: unitNumber,
        route: route,
        status: status,
        price: price,
        origin_address: originAddress,
        origin_latitude: originLatitude ? parseFloat(originLatitude as string) : null,
        origin_longitude: originLongitude ? parseFloat(originLongitude as string) : null,
        destination_address: destinationAddress,
        destination_latitude: destinationLatitude ? parseFloat(destinationLatitude as string) : null,
        destination_longitude: destinationLongitude ? parseFloat(destinationLongitude as string) : null,
      });

    if (error) throw new Error(error.message);
    return { success: true, message: "Ruta creada correctamente." };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}