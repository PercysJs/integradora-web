"use client";

import { useEffect, useState } from "react";
import { Stop } from "../../domain/entities/Stop";
import { StopTable } from "../components/StopTable";
import { StopForm } from "../components/StopForm";
import { StopDeleteDialog } from "../components/StopDeleteDialog";
import { Modal } from "@/shared/components/ui/Modal";
import { supabase } from "@/shared/lib/supabase";

export function StopListView() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  async function loadStops() {
    setLoading(true);
    const { data } = await supabase
      .from("stops")
      .select("*, routes(unit_number, route)")
      .order("created_at", { ascending: false });

    if (data) {
      setStops(data.map((s: any) => ({
        id: s.id,
        name: s.name,
        routeId: s.route_id,
        routeName: s.routes
          ? `Unidad ${s.routes.unit_number} - ${s.routes.route}`
          : "",
        address: s.address,
        latitude: s.latitude,
        longitude: s.longitude,
        createdAt: new Date(s.created_at),
      })));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStops();
  }, []);

  const filtered = stops.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.routeName.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(stop: Stop) {
    setSelectedStop(stop);
    setShowForm(true);
  }

  function handleDelete(stop: Stop) {
    setSelectedStop(stop);
    setShowDelete(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setSelectedStop(null);
  }

  function handleCloseDelete() {
    setShowDelete(false);
    setSelectedStop(null);
  }

  function handleSuccess() {
    handleCloseForm();
    handleCloseDelete();
    loadStops();
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Paradas</h2>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona las paradas de cada ruta.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva parada
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">
            {filtered.length} {filtered.length === 1 ? "parada" : "paradas"} encontradas
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
              placeholder="Buscar parada o ruta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm animate-pulse">Cargando paradas...</p>
          </div>
        ) : (
          <StopTable
            stops={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showForm && (
        <Modal
          title={selectedStop ? "Editar parada" : "Nueva parada"}
          onClose={handleCloseForm}
        >
          <StopForm
            stop={selectedStop ?? undefined}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}

      {showDelete && selectedStop && (
        <Modal title="Confirmar eliminación" onClose={handleCloseDelete}>
          <StopDeleteDialog
            stopId={selectedStop.id}
            stopName={selectedStop.name}
            onSuccess={handleSuccess}
            onCancel={handleCloseDelete}
          />
        </Modal>
      )}

    </div>
  );
}