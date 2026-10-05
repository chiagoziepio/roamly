import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

export function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[65vh] max-w-3xl place-items-center px-5 text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#f0e7d7] text-[#e75d43]">
          <Icon name="compass" className="size-8" />
        </span>
        <p className="eyebrow mt-7">404 · Off the map</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-7xl">
          This road goes nowhere.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-[#687069]">
          The page may have moved, but there are plenty of other places worth
          exploring.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to explore
        </Link>
      </div>
    </section>
  );
}
