"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { createTicketAction } from "../actions/createTicketAction";
import { Ticket } from "../../domain/entities/Ticket";

interface RouteOption {
  id: string;
  unitNumber: string;
  label: string;
  price: number;
  originAddress: string;
  destinationAddress: string;
}

interface ScheduleOption {
  id: string;
  time: string;
}

interface TicketFormProps {
  onSuccess: (ticket: Ticket) => void;
  onCancel: () => void;
}

export function TicketForm({ onSuccess, onCancel }: TicketFormProps) {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [schedules, setSchedules] = useState<ScheduleOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [passengerName, setPassengerName] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noSchedules, setNoSchedules] = useState(false);

  useEffect(() => {
    loadRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRoutes() {
    const { data } = await supabase
      .from("routes")
      .select("id, unit_number, route, price, origin_address, destination_address")
      .eq("status", "Activa")
      .order("unit_number", { ascending: true });

    if (data) {
      setRoutes(data.map((r: Record<string, unknown>) => ({
        id: r.id as string,
        unitNumber: r.unit_number as string,
        label: `Unidad ${r.unit_number} - ${r.route}`,
        price: r.price as number,
        originAddress: r.origin_address as string,
        destinationAddress: r.destination_address as string,
      })));
    }
  }

  async function loadSchedules(routeId: string) {
    const { data } = await supabase
      .from("schedules")
      .select("id, time")
      .eq("route_id", routeId)
      .order("time", { ascending: true });

    if (data) {
      const now = new Date();
      // Hora actual en México (UTC-6)
      const mexicoHours = now.getUTCHours() - 6;
      const adjustedHours = mexicoHours < 0 ? mexicoHours + 24 : mexicoHours;
      const currentTime = `${String(adjustedHours).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;

      const available = data.filter((s: Record<string, unknown>) =>
        (s.time as string) > currentTime
      );

      setSchedules(available.map((s: Record<string, unknown>) => ({
        id: s.id as string,
        time: s.time as string,
      })));

      setNoSchedules(available.length === 0);
    }
    setDepartureTime("");
  }

  function handleRouteChange(routeId: string) {
    const route = routes.find(r => r.id === routeId) ?? null;
    setSelectedRoute(route);
    setNoSchedules(false);
    if (routeId) loadSchedules(routeId);
    else setSchedules([]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("passengerName", passengerName);
    formData.set("routeId", selectedRoute?.id ?? "");
    formData.set("unitNumber", selectedRoute?.unitNumber ?? "");
    formData.set("departureTime", departureTime);
    formData.set("price", String(selectedRoute?.price ?? 0));

    const result = await createTicketAction(formData);

    if (result.success) {
      const ticket: Ticket = {
        id: "",
        folio: result.folio,
        passengerName,
        routeId: selectedRoute?.id ?? "",
        unitNumber: selectedRoute?.unitNumber ?? "",
        routeName: selectedRoute?.label ?? "",
        originAddress: selectedRoute?.originAddress ?? "",
        destinationAddress: selectedRoute?.destinationAddress ?? "",
        departureTime,
        price: selectedRoute?.price ?? 0,
        createdAt: new Date(),
      };
      onSuccess(ticket);
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Nombre del pasajero</label>
        <input
          type="text"
          required
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          placeholder="Ej: Juan Pérez"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Ruta</label>
        <select
          required
          defaultValue=""
          onChange={(e) => handleRouteChange(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecciona una ruta</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </div>

      {selectedRoute && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-2">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Información de la ruta</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Origen:</span>
            <span className="text-xs font-medium text-gray-800">{selectedRoute.originAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Destino:</span>
            <span className="text-xs font-medium text-gray-800">{selectedRoute.destinationAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Precio:</span>
            <span className="text-sm font-bold text-green-700">${selectedRoute.price.toFixed(2)}</span>
          </div>
        </div>
      )}

      {noSchedules && selectedRoute && (
        <p className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-center">
          ⚠️ No hay más salidas disponibles hoy para esta ruta.
        </p>
      )}

      {schedules.length > 0 && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Hora de salida</label>
          <select
            required
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona un horario</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.time}>{s.time}</option>
            ))}
          </select>
        </div>
      )}

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
          disabled={loading || !selectedRoute || !departureTime}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Generando..." : "Generar boleto"}
        </button>
      </div>

    </form>
  );
}