"use client";

import { supabase } from "@/shared/lib/supabase";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10 shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-blue-700">
          Sistema De Administracion
        </h1>
        <p className="text-xs text-gray-400">ABS Autobuses Blancos del Sur</p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        Cerrar sesión
      </button>
    </header>
  );
}