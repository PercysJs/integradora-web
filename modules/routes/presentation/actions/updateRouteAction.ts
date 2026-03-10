"use server";

import { supabase } from "@/shared/lib/supabase";

export async function updateRouteAction(id: string, formData: FormData) {
  const unitNumber = formData.get("unitNumber") as string;
  const route = formData.get("route") as string;
  const status = formData.get("status") as "Activa" | "Inactiva";
  const originAddress = formData.get("originAddress") as string;
  const originLatitude = formData.get("originLatitude");
  const originLongitude = formData.get("originLongitude");
  const destinationAddress = formData.get("destinationAddress") as string;
  const destinationLatitude = formData.get("destinationLatitude");
  const destinationLongitude = formData.get("destinationLongitude");

  console.log("Saving coords:", { originLatitude, originLongitude, destinationLatitude, destinationLongitude });

  try {
    const { error } = await supabase
      .from("routes")
      .update({
        unit_number: unitNumber,
        route: route,
        status: status,
        origin_address: originAddress,
        origin_latitude: originLatitude ? parseFloat(originLatitude as string) : null,
        origin_longitude: originLongitude ? parseFloat(originLongitude as string) : null,
        destination_address: destinationAddress,
        destination_latitude: destinationLatitude ? parseFloat(destinationLatitude as string) : null,
        destination_longitude: destinationLongitude ? parseFloat(destinationLongitude as string) : null,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true, message: "Ruta actualizada correctamente." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}