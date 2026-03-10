import { WeatherCard } from "@/shared/components/ui/WeatherCard";
import { MapView } from "@/shared/components/ui/MapView";
import { supabase } from "@/shared/lib/supabase";

async function getCounts() {
  const [routes, stops, schedules] = await Promise.all([
    supabase.from("routes").select("*", { count: "exact", head: true }),
    supabase.from("stops").select("*", { count: "exact", head: true }),
    supabase.from("schedules").select("*", { count: "exact", head: true }),
  ]);

  return {
    routes: routes.count ?? 0,
    stops: stops.count ?? 0,
    schedules: schedules.count ?? 0,
  };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  return (
    <div className="flex flex-col gap-4">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-100 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rutas</p>
            <p className="text-lg font-bold text-gray-800">{counts.routes}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-100 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Paradas</p>
            <p className="text-lg font-bold text-gray-800">{counts.stops}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-100 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Horarios</p>
            <p className="text-lg font-bold text-gray-800">{counts.schedules}</p>
          </div>
        </div>

        <WeatherCard />
      </div>

      <MapView />

    </div>
  );
}