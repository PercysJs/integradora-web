"use client";

import { useEffect, useState } from "react";
import { Ticket } from "../../domain/entities/Ticket";
import { TicketTable } from "../components/TicketTable";
import { TicketForm } from "../components/TicketForm";
import { Modal } from "@/shared/components/ui/Modal";
import { TicketRepository } from "../../infrastructure/repositories/TicketRepository";
import { GetTicketsUseCase } from "../../application/use-cases/GetTicketsUseCase";
import { TicketPrint } from "../components/TicketPrint";
import { supabase } from "@/shared/lib/supabase";

interface UnitOption {
  value: string;
  label: string;
}

export function TicketListView() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filtered, setFiltered] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [printTicket, setPrintTicket] = useState<Ticket | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [units, setUnits] = useState<UnitOption[]>([]);

  async function loadTickets() {
    setLoading(true);
    try {
      const repository = new TicketRepository();
      const useCase = new GetTicketsUseCase(repository);
      const data = await useCase.execute();
      setTickets(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadUnits() {
    const { data } = await supabase
      .from("tickets")
      .select("unit_number")
      .order("unit_number", { ascending: true });

    if (data) {
      const unique = [...new Set(data.map((r: Record<string, unknown>) => r.unit_number as string))];
      setUnits(unique.map(u => ({ value: u, label: `Unidad ${u}` })));
    }
  }

  useEffect(() => {
    loadTickets();
    loadUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, filterUnit, tickets]);

  function applyFilters() {
    let result = [...tickets];

    if (filterDate) {
      result = result.filter((t) => {
        const date = new Intl.DateTimeFormat("es-MX", {
          timeZone: "America/Mexico_City",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(t.createdAt));

        const [day, month, year] = date.split("/");
        const ticketDate = `${year}-${month}-${day}`;
        return ticketDate === filterDate;
      });
    }

    if (filterUnit) {
      result = result.filter((t) => t.unitNumber === filterUnit);
    }

    setFiltered(result);
  }

  function clearFilters() {
    setFilterDate("");
    setFilterUnit("");
  }

  function handleSuccess(ticket: Ticket) {
    setShowForm(false);
    setPrintTicket(ticket);
    loadTickets();
  }

  const totalVentas = filtered.reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Boletos</h2>
          <p className="text-gray-500 text-sm mt-1">
            Gestión de venta de boletos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo boleto
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-100 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total boletos</p>
            <p className="text-xl font-bold text-gray-800">{filtered.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-100 flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total ventas</p>
            <p className="text-xl font-bold text-gray-800">${totalVentas.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Filtrar boletos</p>
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Por fecha</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Por unidad</label>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las unidades</option>
              {units.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>

          {(filterDate || filterUnit) && (
            <button
              onClick={clearFilters}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          )}
        </div>

        {(filterDate || filterUnit) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Mostrando <span className="font-bold text-gray-800">{filtered.length}</span> boletos
              {filterDate && (
                <span> del <span className="font-bold text-gray-800">
                  {new Intl.DateTimeFormat("es-MX", {
                    timeZone: "America/Mexico_City",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(filterDate + "T12:00:00"))}
                </span></span>
              )}
              {filterUnit && <span> · Unidad <span className="font-bold text-gray-800">{filterUnit}</span></span>}
              {" · "} Total: <span className="font-bold text-green-700">${totalVentas.toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">
            {filtered.length} {filtered.length === 1 ? "boleto" : "boletos"} vendidos
          </p>
        </div>
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm animate-pulse">Cargando boletos...</p>
          </div>
        ) : (
          <TicketTable tickets={filtered} />
        )}
      </div>

      {/* Modal Nuevo Boleto */}
      {showForm && (
        <Modal title="Nuevo boleto" onClose={() => setShowForm(false)}>
          <TicketForm
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}

      {/* Modal Imprimir Boleto */}
      {printTicket && (
        <Modal title="Boleto generado" onClose={() => setPrintTicket(null)}>
          <TicketPrint
            ticket={printTicket}
            onClose={() => setPrintTicket(null)}
          />
        </Modal>
      )}

    </div>
  );
}