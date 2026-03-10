"use server";

import { supabase } from "@/shared/lib/supabase";

export async function createStopAction(formData: FormData) {
  const name = formData.get("name") as string;
  const routeId = formData.get("routeId") as string;
  const address = formData.get("address") as string;
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");

  try {
    const { error } = await supabase
      .from("stops")
      .insert({
        name,
        route_id: routeId,
        address,
        latitude: latitude ? parseFloat(latitude as string) : null,
        longitude: longitude ? parseFloat(longitude as string) : null,
      });

    if (error) throw new Error(error.message);
    return { success: true, message: "Parada creada correctamente." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}