"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "../actions/registerAction";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const result = await registerAction(formData);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Nombre completo
        </label>
        <input
          name="fullName"
          type="text"
          required
          placeholder="eje.Percy Perez"
          className="w-full border border-black-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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
          placeholder="Mínimo 8 caracteres"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Confirmar contraseña
        </label>
        <input
          name="confirm"
          type="password"
          required
          placeholder="Repite tu contraseña"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 mt-2"
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      <p className="text-sm text-center text-gray-500 mt-1">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          Inicia sesión
        </a>
      </p>
    </form>
  );
}