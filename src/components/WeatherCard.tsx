import { useCallback, useEffect, useState } from "react";
import {
  getWeather,
  weatherLabel,
  type WeatherResult,
} from "../services/weather";
import { Icon } from "./Icon";

export function WeatherCard({
  city,
  latitude,
  longitude,
}: {
  city: string;
  latitude: number;
  longitude: number;
}) {
  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError("");
      try {
        setWeather(await getWeather(latitude, longitude, signal));
      } catch (caught) {
        if ((caught as Error).name !== "AbortError")
          setError((caught as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [latitude, longitude],
  );
  useEffect(() => {
    const controller = new AbortController();
    getWeather(latitude, longitude, controller.signal)
      .then(setWeather)
      .catch((caught: Error) => {
        if (caught.name !== "AbortError") setError(caught.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [latitude, longitude]);
  return (
    <section className="rounded-[1.75rem] bg-[#1f5c4a] p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-white/60">
            Live in {city}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Weather now
          </h2>
        </div>
        <Icon name="weather" className="size-9 text-[#f2c14e]" />
      </div>
      {loading && (
        <div className="mt-8 h-24 animate-pulse rounded-2xl bg-white/10" />
      )}
      {error && !loading && (
        <div className="mt-7">
          <p className="text-sm text-white/75">{error}</p>
          <button
            onClick={() => void load()}
            className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#17211b]"
          >
            Try again
          </button>
        </div>
      )}
      {weather && !loading && (
        <div className="mt-7">
          <div className="flex items-end justify-between">
            <strong className="font-display text-6xl font-semibold">
              {weather.temperature}°
            </strong>
            <span className="mb-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              {weatherLabel(weather.weatherCode)}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5 text-sm">
            <div>
              <span className="block text-white/50">Feels</span>
              <strong>{weather.apparentTemperature}°</strong>
            </div>
            <div>
              <span className="block text-white/50">High / low</span>
              <strong>
                {weather.high}° / {weather.low}°
              </strong>
            </div>
            <div>
              <span className="block text-white/50">Wind</span>
              <strong>{weather.windSpeed} km/h</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
