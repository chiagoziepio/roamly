export type WeatherResult = {
  temperature: number
  apparentTemperature: number
  weatherCode: number
  windSpeed: number
  high: number
  low: number
}

export type CitySearchResult = {
  id: number
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
}

export async function getWeather(latitude: number, longitude: number, signal?: AbortSignal) {
  const params = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min', timezone: 'auto', forecast_days: '1',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal })
  if (!response.ok) throw new Error('Weather is unavailable right now.')
  const data = await response.json()
  return {
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    weatherCode: data.current.weather_code,
    windSpeed: Math.round(data.current.wind_speed_10m),
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
  } as WeatherResult
}

export async function searchCities(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ name: query, count: '6', language: 'en', format: 'json' })
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal })
  if (!response.ok) throw new Error('City search is unavailable right now.')
  const data = await response.json()
  return (data.results ?? []) as CitySearchResult[]
}

export function weatherLabel(code: number) {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Misty'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Rain showers'
  return 'Stormy'
}
