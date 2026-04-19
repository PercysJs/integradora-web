"use client";

import { useState } from "react";
import { Route } from "../../domain/entities/Route";
import { createRouteAction } from "../actions/createRouteAction";
import { updateRouteAction } from "../actions/updateRouteAction";

interface RouteFormProps {
  route?: Route;
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
    console.log("Geocode result:", data);
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch (e) {
    console.error("Geocode error:", e);
    return null;
  }
}

export function RouteForm({ route, onSuccess, onCancel }: RouteFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const originAddress = formData.get("originAddress") as string;
    const destinationAddress = formData.get("destinationAddress") as string;

    const [originCoords, destinationCoords] = await Promise.all([
      geocode(originAddress),
      geocode(destinationAddress),
    ]);

    if (!originCoords) {
      setError("No se encontró la dirección de origen. Intenta ser más específico.");
      setLoading(false);
      return;
    }

    if (!destinationCoords) {
      setError("No se encontró la dirección de destino. Intenta ser más específico.");
      setLoading(false);
      return;
    }

    formData.set("originLatitude", String(originCoords.lat));
    formData.set("originLongitude", String(originCoords.lng));
    formData.set("destinationLatitude", String(destinationCoords.lat));
    formData.set("destinationLongitude", String(destinationCoords.lng));

    const result = route
      ? await updateRouteAction(route.id, formData)
      : await createRouteAction(formData);

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
        <label className="text-sm font-semibold text-gray-700">Número de unidad</label>
        <input
          name="unitNumber"
          type="text"
          required
          defaultValue={route?.unitNumber}
          placeholder="Ej: 11"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Ruta</label>
        <input
          name="route"
          type="text"
          required
          defaultValue={route?.route}
          placeholder="Ej: Puebla - Veracruz"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Dirección de origen</label>
        <input
          name="originAddress"
          type="text"
          required
          defaultValue={route?.originAddress}
          placeholder="Ej: Puebla, Puebla, México"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400">Formato: Ciudad, Estado, México</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Dirección de destino</label>
        <input
          name="destinationAddress"
          type="text"
          required
          defaultValue={route?.destinationAddress}
          placeholder="Ej: Veracruz, Veracruz, México"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400">Formato: Ciudad, Estado, México</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Precio del boleto</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={route?.price ?? ""}
            placeholder="0.00"
            className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Estado</label>
        <select
          name="status"
          required
          defaultValue={route?.status ?? ""}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecciona un estado</option>
          <option value="Activa">Activa</option>
          <option value="Inactiva">Inactiva</option>
        </select>
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
          {loading ? "Buscando ubicaciones..." : route ? "Actualizar" : "Crear ruta"}
        </button>
      </div>
    </form>
  );
}