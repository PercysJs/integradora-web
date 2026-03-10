"use client";

import { useEffect, useState } from "react";
import { Schedule } from "../../domain/entities/Schedule";
import { ScheduleTable } from "../components/ScheduleTable";
import { ScheduleForm } from "../components/ScheduleForm";
import { ScheduleDeleteDialog } from "../components/ScheduleDeleteDialog";
import { Modal } from "@/shared/components/ui/Modal";
import { supabase } from "@/shared/lib/supabase";

export function ScheduleListView() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  async function loadSchedules() {
    setLoading(true);
    const { data } = await supabase
      .from("schedules")
      .select("*, routes(unit_number, route)")
      .order("time", { ascending: true });

    if (data) {
      setSchedules(data.map((s: any) => ({
        id: s.id,
        time: s.time,
        routeId: s.route_id,
        routeName: s.routes
          ? `Unidad ${s.routes.unit_number} - ${s.routes.route}`
          : "",
        createdAt: new Date(s.created_at),
      })));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  const filtered = schedules.filter((s) =>
    s.time.includes(search) ||
    s.routeName.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(schedule: Schedule) {
    setSelectedSchedule(schedule);
    setShowForm(true);
  }

  function handleDelete(schedule: Schedule) {
    setSelectedSchedule(schedule);
    setShowDelete(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setSelectedSchedule(null);
  }

  function handleCloseDelete() {
    setShowDelete(false);
    setSelectedSchedule(null);
  }

  function handleSuccess() {
    handleCloseForm();
    handleCloseDelete();
    loadSchedules();
  }

  return (
    <div className="flex flex-col gap-6">

      {/* este es el encabezado :v */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Horarios</h2>
          <p className="text-gray-500 text-sm mt-1">
            Gestion de los horarios de salida de cada ruta.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo horario
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">
            {filtered.length} {filtered.length === 1 ? "horario" : "horarios"} encontrados
          </p>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por hora o ruta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm animate-pulse">Cargando horarios...</p>
          </div>
        ) : (
          <ScheduleTable
            schedules={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal Crear y el del Editar */}
      {showForm && (
        <Modal
          title={selectedSchedule ? "Editar horario" : "Nuevo horario"}
          onClose={handleCloseForm}
        >
          <ScheduleForm
            schedule={selectedSchedule ?? undefined}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}

      {/* Modal Eliminar */}
      {showDelete && selectedSchedule && (
        <Modal title="Confirmar eliminación" onClose={handleCloseDelete}>
          <ScheduleDeleteDialog
            scheduleId={selectedSchedule.id}
            scheduleTime={selectedSchedule.time}
            onSuccess={handleSuccess}
            onCancel={handleCloseDelete}
          />
        </Modal>
      )}

    </div>
  );
}