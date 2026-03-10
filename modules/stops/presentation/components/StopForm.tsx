"use client";

import { useEffect, useState } from "react";
import { Stop } from "../../domain/entities/Stop";
import { createStopAction } from "../actions/createStopAction";
import { updateStopAction } from "../actions/updateStopAction";
import { supabase } from "@/shared/lib/supabase";

interface RouteOption {
  id: string;
  label: string;
}

interface StopFormProps {
  stop?: Stop;
  onSuccess: () => void;
  onCancel: () => void;
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=mx`,
      {
        headers: {
          "Accept-Language": "es",
          "User-Agent": "ABS-Transport-App/1.0",
        },
      }
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export function StopForm({ stop, onSuccess, onCancel }: StopFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState(stop?.routeId ?? "");

  useEffect(() => {
    async function loadRoutes() {
      const { data } = await supabase
        .from("routes")
        .select("id, unit_number, route")
        .eq("status", "Activa")
        .order("unit_number", { ascending: true });

      if (data) {
        setRoutes(data.map((r: any) => ({
          id: r.id,
          label: `Unidad ${r.unit_number} - ${r.route}`,
        })));
      }
    }
    loadRoutes();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const address = formData.get("address") as string;

    const coords = await geocode(address);
    if (!coords) {
      setError("No se encontró la dirección. Intenta ser más específico.");
      setLoading(false);
      return;
    }

    formData.set("latitude", String(coords.lat));
    formData.set("longitude", String(coords.lng));

    const result = stop
      ? await updateStopAction(stop.id, formData)
      : await createStopAction(formData);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Ruta</label>
        {stop ? (
          <>
            <input type="hidden" name="routeId" value={selectedRouteId} />
            <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 bg-gray-50">
              {stop.routeName}
            </div>
          </>
        ) : (
          <select
            name="routeId"
            required
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona una ruta activa</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Nombre de la parada</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={stop?.name}
          placeholder="Ej: Amozoc"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Dirección</label>
        <input
          name="address"
          type="text"
          required
          defaultValue={stop?.address}
          placeholder="Ej: Amozoc, Puebla, México"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400">Formato: Ciudad, Estado, México</p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Buscando ubicación..." : stop ? "Actualizar" : "Crear parada"}
        </button>
      </div>
    </form>
  );
}