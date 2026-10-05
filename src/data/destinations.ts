import type { Destination } from "../types";

export const destinations: Destination[] = [
  {
    slug: "kyoto-japan",
    city: "Kyoto",
    country: "Japan",
    region: "Asia",
    tagline: "Temples, tea houses, and quiet moments.",
    description:
      "Walk through vermilion gates at dawn, linger over seasonal kaiseki, and discover a city where centuries-old rituals meet thoughtful modern design.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
    styles: ["Culture", "Food", "Nature"],
    rating: 4.9,
    price: "$$$",
    coordinates: { latitude: 35.0116, longitude: 135.7681 },
    highlights: [
      {
        title: "Fushimi Inari",
        detail: "Hike beneath thousands of vermilion torii gates.",
      },
      {
        title: "Gion at dusk",
        detail: "Lantern-lit lanes, machiya houses, and tiny tea rooms.",
      },
      {
        title: "Arashiyama",
        detail: "Bamboo groves, riverside paths, and mountain temples.",
      },
    ],
  },
  {
    slug: "lisbon-portugal",
    city: "Lisbon",
    country: "Portugal",
    region: "Europe",
    tagline: "Sun-washed streets with an Atlantic soul.",
    description:
      "Ride yellow trams over seven hills, follow the sound of fado into Alfama, and end the day with fresh seafood beside the Tagus.",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1600&q=85",
    styles: ["Culture", "Food", "Coast"],
    rating: 4.8,
    price: "$$",
    coordinates: { latitude: 38.7223, longitude: -9.1393 },
    highlights: [
      {
        title: "Alfama lanes",
        detail: "Lose an afternoon in the city’s oldest neighborhood.",
      },
      {
        title: "Belém",
        detail: "Riverside monuments and warm pastéis de nata.",
      },
      {
        title: "Sintra escape",
        detail: "A fairytale day trip of palaces and forested hills.",
      },
    ],
  },
  {
    slug: "marrakech-morocco",
    city: "Marrakech",
    country: "Morocco",
    region: "Africa",
    tagline: "A vivid maze of spice, craft, and color.",
    description:
      "Move between fragrant souks, tiled courtyards, rooftop dinners, and the cinematic landscapes of the nearby Atlas Mountains.",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
    styles: ["Culture", "Food"],
    rating: 4.7,
    price: "$$",
    coordinates: { latitude: 31.6295, longitude: -7.9811 },
    highlights: [
      {
        title: "The medina",
        detail: "A sensory maze of textiles, ceramics, and spices.",
      },
      {
        title: "Majorelle Garden",
        detail: "Cobalt architecture surrounded by rare botanicals.",
      },
      {
        title: "Atlas day trip",
        detail: "Mountain villages and dramatic valleys beyond the city.",
      },
    ],
  },
  {
    slug: "reykjavik-iceland",
    city: "Reykjavík",
    country: "Iceland",
    region: "Europe",
    tagline: "Wild horizons from a creative little capital.",
    description:
      "Pair cozy design cafés and colorful streets with waterfalls, geothermal lagoons, black-sand beaches, and long northern light nights.",
    image:
      "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1600&q=85",
    styles: ["Nature"],
    rating: 4.9,
    price: "$$$$",
    coordinates: { latitude: 64.1466, longitude: -21.9426 },
    highlights: [
      {
        title: "Golden Circle",
        detail: "Geysers, waterfalls, and rift-valley landscapes.",
      },
      {
        title: "Sky Lagoon",
        detail: "Geothermal bathing with an ocean-edge view.",
      },
      {
        title: "South Coast",
        detail: "Waterfalls and black beaches on one epic drive.",
      },
    ],
  },
  {
    slug: "bali-indonesia",
    city: "Ubud",
    country: "Indonesia",
    region: "Asia",
    tagline: "Rice terraces, rituals, and restorative days.",
    description:
      "Settle into a slower rhythm of jungle walks, temple ceremonies, nourishing food, and workshops led by the island’s creative community.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
    styles: ["Nature", "Culture", "Food"],
    rating: 4.8,
    price: "$$",
    coordinates: { latitude: -8.5069, longitude: 115.2625 },
    highlights: [
      {
        title: "Tegalalang",
        detail: "Sculptural rice terraces glowing in early light.",
      },
      {
        title: "Water temples",
        detail: "Sacred springs and intricate stone gateways.",
      },
      {
        title: "Campuhan Ridge",
        detail: "A gentle sunrise walk above the jungle.",
      },
    ],
  },
  {
    slug: "amalfi-italy",
    city: "Amalfi",
    country: "Italy",
    region: "Europe",
    tagline: "Cliffside villages above impossible blue.",
    description:
      "Cruise between pastel villages, swim in hidden coves, and stretch long lunches into golden evenings scented with lemon blossom.",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85",
    styles: ["Coast", "Food"],
    rating: 4.8,
    price: "$$$$",
    coordinates: { latitude: 40.634, longitude: 14.6027 },
    highlights: [
      {
        title: "Path of the Gods",
        detail: "A high trail with extraordinary coastal views.",
      },
      { title: "Ravello", detail: "Garden villas and music above the sea." },
      {
        title: "Boat afternoon",
        detail: "Find coves and villages from the water.",
      },
    ],
  },
];

export function getDestination(slug: string | undefined) {
  return destinations.find((destination) => destination.slug === slug);
}
