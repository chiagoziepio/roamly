import { useRef, useState, type FormEvent } from 'react'
import { getWeather, searchCities, weatherLabel, type CitySearchResult, type WeatherResult } from '../services/weather'
import { Icon } from './Icon'

export function CitySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CitySearchResult[]>([])
  const [selected, setSelected] = useState<CitySearchResult | null>(null)
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const controller = useRef<AbortController | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (query.trim().length < 2) { setError('Enter at least two letters.'); return }
    controller.current?.abort(); controller.current = new AbortController()
    setLoading(true); setError(''); setSelected(null); setWeather(null); setHasSearched(true)
    try { setResults(await searchCities(query.trim(), controller.current.signal)) }
    catch (caught) { if ((caught as Error).name !== 'AbortError') setError((caught as Error).message) }
    finally { setLoading(false) }
  }

  async function preview(city: CitySearchResult) {
    setSelected(city); setWeather(null); setError(''); setLoading(true)
    try { setWeather(await getWeather(city.latitude, city.longitude)) }
    catch (caught) { setError((caught as Error).message) }
    finally { setLoading(false) }
  }

  return <div className="rounded-[2rem] bg-white p-5 shadow-[0_20px_70px_rgba(23,33,27,.08)] ring-1 ring-black/5 md:p-7">
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1"><span className="sr-only">Search any city</span><Icon name="search" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7d847e]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-14 w-full rounded-full border border-black/10 bg-[#f8f6f1] pl-12 pr-5 outline-none transition placeholder:text-[#8a908b] focus:border-[#e75d43] focus:ring-4 focus:ring-[#e75d43]/10" placeholder="Try Lagos, Paris, or Seoul" /></label>
      <button className="btn-primary h-14 sm:px-8" disabled={loading}>{loading ? 'Searching…' : 'Search the world'}</button>
    </form>
    {error && <div role="alert" className="mt-4 flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => setError('')} className="font-bold">Dismiss</button></div>}
    {!loading && hasSearched && results.length === 0 && !error && <p className="mt-5 text-sm text-[#727972]">No matching cities found. Try a nearby city or check the spelling.</p>}
    {results.length > 0 && <div className="mt-5 border-t border-black/10 pt-3">
      {results.map((city) => <button key={city.id} onClick={() => preview(city)} className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-[#f4f1ea] ${selected?.id === city.id ? 'bg-[#f4f1ea]' : ''}`}>
        <span><span className="block font-semibold">{city.name}</span><span className="text-sm text-[#747b75]">{[city.admin1, city.country].filter(Boolean).join(', ')}</span></span>
        {selected?.id === city.id && weather ? <span className="text-right"><strong className="block text-xl">{weather.temperature}°</strong><span className="text-xs text-[#747b75]">{weatherLabel(weather.weatherCode)}</span></span> : <span className="flex items-center gap-1 text-sm font-bold text-[#e75d43]">Live weather <Icon name="chevron" className="size-4" /></span>}
      </button>)}
    </div>}
  </div>
}
