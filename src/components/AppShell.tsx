import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { getDestination } from "../data/destinations";
import { Icon } from "./Icon";

const navItems = [
  { to: "/", label: "Explore", icon: "compass" as const },
  { to: "/planner", label: "Planner", icon: "calendar" as const },
  { to: "/trip", label: "My trip", icon: "map" as const },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { trip } = useTrip();
  const tripDestination = getDestination(trip.destinationSlug);
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#17211b]">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f6f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <NavLink
            to="/"
            className="flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid size-10 place-items-center rounded-full bg-[#e75d43] text-white">
              <Icon name="sparkle" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">
              Roamly
            </span>
          </NavLink>
          <nav
            className="hidden items-center gap-1 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5 md:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${isActive ? "bg-[#17211b] text-white" : "text-[#687069] hover:bg-[#f0eee8] hover:text-[#17211b]"}`
                }
              >
                <Icon name={item.icon} className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink
            to="/trip"
            className="hidden rounded-full border border-[#17211b]/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-white md:block"
          >
            {tripDestination?.city} ·{" "}
            {new Date(`${trip.startDate}T12:00:00`).toLocaleDateString("en", {
              month: "short",
              day: "numeric",
            })}
          </NavLink>
          <button
            className="grid size-11 place-items-center rounded-full bg-white ring-1 ring-black/5 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-black/5 bg-[#f8f6f1] px-5 py-4 md:hidden"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold ${isActive ? "bg-[#17211b] text-white" : ""}`
                }
              >
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-24 border-t border-black/10 bg-[#17211b] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-display text-2xl font-semibold">Roamly</p>
            <p className="mt-1 text-sm text-white/55">
              Go somewhere worth remembering.
            </p>
          </div>
          <p className="text-sm text-white/45">
            Designed for curious travelers.
          </p>
        </div>
      </footer>
    </div>
  );
}
