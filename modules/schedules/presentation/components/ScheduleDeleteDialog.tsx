"use client";

import { useState } from "react";
import { deleteScheduleAction } from "../actions/deleteScheduleAction";

interface ScheduleDeleteDialogProps {
  scheduleId: string;
  scheduleTime: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScheduleDeleteDialog({ scheduleId, scheduleTime, onSuccess, onCancel }: ScheduleDeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    const result = await deleteScheduleAction(scheduleId);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800">¿Eliminar horario?</h3>
        <p className="text-sm text-gray-500 mt-1">
          Estás por eliminar el horario de las <span className="font-semibold text-gray-700">&quot;{scheduleTime}&quot;</span>. Esta acción no se puede deshacer.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Eliminando..." : "Sí, eliminar"}
        </button>
      </div>
    </div>
  );
}