"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  description: string;
  humidity: number;
  wind: number;
  icon: string;
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("El navegador no soporta geolocalización.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`
          );
          const data = await res.json();

          setWeather({
            city: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 3.6),
            icon: data.weather[0].icon,
          });
        } catch {
          setError("No se pudo obtener el clima.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("No se pudo obtener tu ubicación.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl px-4 py-3 text-white flex items-center justify-center">
        <p className="text-blue-100 text-xs animate-pulse">Obteniendo clima...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl px-4 py-3 text-white flex items-center justify-center">
        <p className="text-blue-100 text-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl px-4 py-3 text-white shadow-sm border border-blue-400/20 flex items-center gap-3">

      <img
        src={`https://openweathermap.org/img/wn/${weather?.icon}.png`}
        alt={weather?.description}
        className="w-10 h-10"
      />

      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-lg leading-none">
          {weather?.temp}°C
        </p>
        <p className="text-blue-200 text-xs capitalize truncate">
          {weather?.description}
        </p>
        <p className="text-blue-200 text-xs truncate">
          {weather?.city}, {weather?.country}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-white text-xs font-semibold">{weather?.humidity}% 💧</p>
        <p className="text-white text-xs font-semibold">{weather?.wind} km/h 💨</p>
        <p className="text-white text-xs font-semibold">{weather?.feels_like}°C 🌡️</p>
      </div>

    </div>
  );
}