"use client";

import { useEffect, useState } from "react";
import { Route } from "../../domain/entities/Route";
import { RouteTable } from "../components/RouteTable";
import { RouteForm } from "../components/RouteForm";
import { RouteDeleteDialog } from "../components/RouteDeleteDialog";
import { RouteSearchBar } from "../components/RouteSearchBar";
import { Modal } from "@/shared/components/ui/Modal";
import { supabase } from "@/shared/lib/supabase";

export function RouteListView() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  async function loadRoutes() {
    setLoading(true);
    const { data } = await supabase
      .from("routes")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setRoutes(data.map((r: any) => ({
        id: r.id,
        unitNumber: r.unit_number,
        route: r.route,
        status: r.status,
        originAddress: r.origin_address,
        originLatitude: r.origin_latitude,
        originLongitude: r.origin_longitude,
        destinationAddress: r.destination_address,
        destinationLatitude: r.destination_latitude,
        destinationLongitude: r.destination_longitude,
        createdAt: new Date(r.created_at),
      })));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  const filtered = routes.filter((r) =>
    r.unitNumber.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(route: Route) {
    setSelectedRoute(route);
    setShowForm(true);
  }

  function handleDelete(route: Route) {
    setSelectedRoute(route);
    setShowDelete(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setSelectedRoute(null);
  }

  function handleCloseDelete() {
    setShowDelete(false);
    setSelectedRoute(null);
  }

  function handleSuccess() {
    handleCloseForm();
    handleCloseDelete();
    loadRoutes();
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Rutas</h2>
          <p className="text-gray-500 text-sm mt-1">
            Gestión de Rutas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva ruta
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">
            {filtered.length} {filtered.length === 1 ? "ruta" : "rutas"} encontradas
          </p>
          <RouteSearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm animate-pulse">Cargando rutas...</p>
          </div>
        ) : (
          <RouteTable
            routes={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal CrearyEditar */}
      {showForm && (
        <Modal
          title={selectedRoute ? "Editar ruta" : "Nueva ruta"}
          onClose={handleCloseForm}
        >
          <RouteForm
            route={selectedRoute ?? undefined}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}

      {/* Modal del Eliminar */}
      {showDelete && selectedRoute && (
        <Modal title="Confirmar eliminación" onClose={handleCloseDelete}>
          <RouteDeleteDialog
            routeId={selectedRoute.id}
            routeName={selectedRoute.unitNumber}
            onSuccess={handleSuccess}
            onCancel={handleCloseDelete}
          />
        </Modal>
      )}

    </div>
  );
}