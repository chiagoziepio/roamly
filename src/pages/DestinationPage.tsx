import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { PlanTripModal } from "../components/PlanTripModal";
import { WeatherCard } from "../components/WeatherCard";
import { getDestination } from "../data/destinations";

export function DestinationPage() {
  const { slug } = useParams();
  const destination = getDestination(slug);
  const [planning, setPlanning] = useState(false);
  if (!destination) return <Navigate to="/not-found" replace />;
  return (
    <>
      <section className="mx-auto max-w-360 px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="relative min-h-[70vh] overflow-hidden rounded-4xl bg-black text-white">
          <img
            src={destination.image}
            alt={`${destination.city} landscape`}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/30" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#17211b] backdrop-blur"
            >
              <span className="rotate-180">
                <Icon name="arrow" className="size-4" />
              </span>{" "}
              Back to explore
            </Link>
            <span className="rounded-full bg-black/20 px-4 py-2 text-sm backdrop-blur">
              {destination.region}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-white/70">
              {destination.country} · ★ {destination.rating}
            </p>
            <h1 className="mt-3 font-display text-6xl font-semibold tracking-tight sm:text-8xl">
              {destination.city}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              {destination.tagline}
            </p>
            <button
              onClick={() => setPlanning(true)}
              className="mt-7 rounded-full bg-[#f2c14e] px-6 py-3 font-bold text-[#17211b] transition hover:bg-white"
            >
              Plan this trip
            </button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div>
          <p className="eyebrow">Why you’ll love it</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            A city that rewards the curious.
          </h2>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#626a63]">
            {destination.description}
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {destination.highlights.map((highlight, index) => (
              <article
                key={highlight.title}
                className="rounded-3xl bg-white p-6 ring-1 ring-black/5"
              >
                <span className="grid size-9 place-items-center rounded-full bg-[#f0e7d7] text-sm font-bold text-[#b04e38]">
                  {index + 1}
                </span>
                <h3 className="mt-8 font-display text-2xl font-semibold">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6d746e]">
                  {highlight.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
        <aside>
          <WeatherCard city={destination.city} {...destination.coordinates} />
          <div className="mt-4 rounded-[1.75rem] bg-white p-6 ring-1 ring-black/5">
            <p className="eyebrow">Good to know</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#777e78]">Travel style</dt>
                <dd className="font-bold">{destination.styles.join(", ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#777e78]">Price level</dt>
                <dd className="font-bold">{destination.price}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#777e78]">Best pace</dt>
                <dd className="font-bold">4–5 days</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
      <PlanTripModal
        destination={destination}
        open={planning}
        onClose={() => setPlanning(false)}
      />
    </>
  );
}
