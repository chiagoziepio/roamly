import { Link } from 'react-router-dom'
import type { Destination } from '../types'
import { Icon } from './Icon'

export function DestinationCard({ destination, featured = false }: { destination: Destination; featured?: boolean }) {
  return <article className={`group relative overflow-hidden rounded-[1.75rem] bg-[#17211b] text-white ${featured ? 'min-h-[34rem] md:col-span-2' : 'min-h-[27rem]'}`}>
    <img src={destination.image} alt={`${destination.city}, ${destination.country}`} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15" />
    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
      <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#17211b] backdrop-blur">{destination.styles[0]}</span>
      <button className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white hover:text-[#e75d43]" aria-label={`Save ${destination.city}`}><Icon name="heart" /></button>
    </div>
    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
      <div className="mb-3 flex items-center gap-3 text-sm text-white/75"><span>{destination.country}</span><span>•</span><span>★ {destination.rating}</span><span>•</span><span>{destination.price}</span></div>
      <h3 className={`font-display font-semibold tracking-tight ${featured ? 'text-5xl md:text-6xl' : 'text-4xl'}`}>{destination.city}</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">{destination.tagline}</p>
      <Link to={`/destination/${destination.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#17211b] transition hover:bg-[#f2c14e]">Explore city <Icon name="arrow" className="size-4" /></Link>
    </div>
  </article>
}
