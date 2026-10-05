import { useState } from 'react'
import { CitySearch } from '../components/CitySearch'
import { DestinationCard } from '../components/DestinationCard'
import { Icon } from '../components/Icon'
import { destinations } from '../data/destinations'
import type { TravelStyle } from '../types'

const filters: Array<'All' | TravelStyle> = ['All', 'Culture', 'Nature', 'Food', 'Coast']

export function ExplorePage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const visible = filter === 'All' ? destinations : destinations.filter((destination) => destination.styles.includes(filter))
  return <>
    <section className="relative overflow-hidden px-5 pb-16 pt-16 md:pb-24 md:pt-24 lg:px-8">
      <div className="pointer-events-none absolute -right-32 top-6 size-96 rounded-full bg-[#f2c14e]/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center"><span className="inline-flex items-center gap-2 rounded-full bg-[#f0e7d7] px-4 py-2 text-xs font-bold uppercase tracking-[.17em] text-[#8a4c37]"><Icon name="globe" className="size-4" /> Your next chapter starts here</span><h1 className="mt-8 font-display text-6xl font-semibold leading-[.95] tracking-[-.055em] sm:text-7xl md:text-[6.5rem]">Find a place that <em className="font-normal text-[#e75d43]">moves you.</em></h1><p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#666e67]">Thoughtful guides, live weather, and one simple place to turn inspiration into a trip.</p></div>
        <div className="mx-auto mt-10 max-w-3xl"><CitySearch /></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="flex flex-col gap-6 border-t border-black/10 pt-10 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Handpicked escapes</p><h2 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">Places worth the journey</h2></div><div className="flex flex-wrap gap-2" role="group" aria-label="Filter destinations">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === item ? 'bg-[#17211b] text-white' : 'bg-white text-[#59615b] ring-1 ring-black/10 hover:ring-black/25'}`}>{item}</button>)}</div></div>
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map((destination, index) => <DestinationCard key={destination.slug} destination={destination} featured={filter === 'All' && index === 0} />)}</div>
      {visible.length === 0 && <div className="rounded-3xl bg-white p-12 text-center"><p className="font-display text-2xl">No destinations in this collection yet.</p></div>}
    </section>
    <section className="mx-auto mt-24 max-w-7xl px-5 lg:px-8"><div className="overflow-hidden rounded-[2rem] bg-[#efb7a8] px-6 py-14 md:px-14"><div className="grid items-center gap-10 md:grid-cols-[1fr_.8fr]"><div><p className="eyebrow text-[#783a2c]">Travel, your way</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-6xl">From daydream to day one.</h2><p className="mt-5 max-w-xl leading-7 text-[#623f36]">Choose a destination, build each day, and keep the details that matter close at hand.</p></div><div className="grid grid-cols-3 gap-3">{[['01','Discover'],['02','Plan'],['03','Go']].map(([number,label]) => <div key={number} className="rounded-2xl bg-white/45 p-4"><span className="text-xs font-bold text-[#884d3e]">{number}</span><strong className="mt-8 block font-display text-xl">{label}</strong></div>)}</div></div></div></section>
  </>
}
