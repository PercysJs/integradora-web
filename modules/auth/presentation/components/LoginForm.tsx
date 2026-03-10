"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions/loginAction";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Correo electrónico
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
          className="w-full border border-black-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Contraseña
        </label>
        <input
          name="password"
          type="password"
          required
          placeholder="Tu contraseña"
          className="w-full border border-black-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 mt-2"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <p className="text-sm text-center text-gray-500 mt-1">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-blue-600 font-medium hover:underline">
          Regístrate
        </a>
      </p>
    </form>
  );
}