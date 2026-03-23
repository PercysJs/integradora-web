"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/shared/lib/supabase";

interface RouteOption {
  id: string;
  label: string;
}

export function MapView() {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState("all");

  useEffect(() => {
    async function initMap() {
      const L = (await import("leaflet")).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([19.0414, -98.2063], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      mapInstanceRef.current = map;
      await loadAndDrawRoutes(L, map, "all");
    }

    initMap();
  }, []);

  async function loadAndDrawRoutes(L: any, map: any, filter: string) {
    
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    
    let query = supabase.from("routes").select("*").eq("status", "Activa");
    if (filter !== "all") query = query.eq("id", filter);

    const { data: routesData } = await query;
    if (!routesData) return;

    setRoutes(routesData.map((r: any) => ({
      id: r.id,
      label: `Unidad ${r.unit_number} - ${r.route}`,
    })));

    const allLatLngs: any[] = [];

    for (const route of routesData) {
      // Pin origen 
      if (route.origin_latitude && route.origin_longitude) {
        const icon = L.divIcon({
          html: `<div style="background:#22c55e;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
          className: "", iconSize: [18, 18], iconAnchor: [9, 9],
        });
        const marker = L.marker([route.origin_latitude, route.origin_longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;padding:6px;min-width:150px;">
              <div style="font-size:11px;color:#64748b;">🟢 Origen</div>
              <strong style="font-size:13px;">${route.origin_address}</strong><br/>
              <span style="font-size:11px;color:#1d4ed8;">Unidad ${route.unit_number} - ${route.route}</span>
            </div>
          `);
        markersRef.current.push(marker);
        allLatLngs.push([route.origin_latitude, route.origin_longitude]);
      }

      // Paradas 
      const { data: stops } = await supabase
        .from("stops")
        .select("*")
        .eq("route_id", route.id)
        .order("created_at", { ascending: true });

      if (stops) {
        for (const stop of stops) {
          if (stop.latitude && stop.longitude) {
            const icon = L.divIcon({
              html: `<div style="background:#3b82f6;width:13px;height:13px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
              className: "", iconSize: [13, 13], iconAnchor: [6, 6],
            });
            const marker = L.marker([stop.latitude, stop.longitude], { icon })
              .addTo(map)
              .bindPopup(`
                <div style="font-family:sans-serif;padding:6px;min-width:150px;">
                  <div style="font-size:11px;color:#64748b;">📍 Parada</div>
                  <strong style="font-size:13px;">${stop.name}</strong><br/>
                  <span style="font-size:11px;color:#1d4ed8;">Unidad ${route.unit_number} - ${route.route}</span>
                </div>
              `);
            markersRef.current.push(marker);
            allLatLngs.push([stop.latitude, stop.longitude]);
          }
        }
      }

      // Pin destino 
      if (route.destination_latitude && route.destination_longitude) {
        const icon = L.divIcon({
          html: `<div style="background:#ef4444;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
          className: "", iconSize: [18, 18], iconAnchor: [9, 9],
        });
        const marker = L.marker([route.destination_latitude, route.destination_longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;padding:6px;min-width:150px;">
              <div style="font-size:11px;color:#64748b;">🔴 Destino</div>
              <strong style="font-size:13px;">${route.destination_address}</strong><br/>
              <span style="font-size:11px;color:#1d4ed8;">Unidad ${route.unit_number} - ${route.route}</span>
            </div>
          `);
        markersRef.current.push(marker);
        allLatLngs.push([route.destination_latitude, route.destination_longitude]);
      }
    }

    
    if (allLatLngs.length > 0) {
      map.fitBounds(L.latLngBounds(allLatLngs), { padding: [40, 40] });
    }
  }

  async function handleFilterChange(value: string) {
    setSelectedRoute(value);
    const L = (await import("leaflet")).default;
    await loadAndDrawRoutes(L, mapInstanceRef.current, value);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">Mapa De Rutas y Paradas ABS</h3>
          
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-semibold">Filtrar:</label>
          <select
            value={selectedRoute}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las rutas</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {}
      <div className="flex gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow"></div>
          Origen
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow"></div>
          Destino
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></div>
          Paradas
        </div>
      </div>

      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: "420px", borderRadius: "12px", zIndex: 1 }} />
    </div>
  );
}