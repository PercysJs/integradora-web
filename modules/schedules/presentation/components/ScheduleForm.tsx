"use client";

import { useEffect, useState } from "react";
import { Schedule } from "../../domain/entities/Schedule";
import { createScheduleAction } from "../actions/createScheduleAction";
import { updateScheduleAction } from "../actions/updateScheduleAction";
import { supabase } from "@/shared/lib/supabase";

interface RouteOption {
  id: string;
  label: string;
}

interface ScheduleFormProps {
  schedule?: Schedule;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScheduleForm({ schedule, onSuccess, onCancel }: ScheduleFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);

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
    const result = schedule
      ? await updateScheduleAction(schedule.id, formData)
      : await createScheduleAction(formData);

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
        <label className="text-sm font-semibold text-gray-700">
          Ruta
        </label>
        <select
          name="routeId"
          required
          defaultValue={schedule?.routeId ?? ""}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecciona una ruta activa</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Hora de salida
        </label>
        <input
          name="time"
          type="time"
          required
          defaultValue={schedule?.time}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">Formato 24 horas (HH:MM)</p>
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
          {loading ? "Guardando..." : schedule ? "Actualizar" : "Crear horario"}
        </button>
      </div>
    </form>
  );
}
