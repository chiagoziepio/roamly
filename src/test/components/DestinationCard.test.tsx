import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { DestinationCard } from "../../components/DestinationCard";
import { destinations } from "../../data/destinations";

describe("DestinationCard", () => {
  it("displays destination city, country, rating, price, and tagline", () => {
    const destination = destinations[0];

    render(
      <MemoryRouter>
        <DestinationCard destination={destination} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: destination.city,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(destination.country)).toBeInTheDocument();

    expect(
      screen.getByText(destination.rating.toString(), {
        exact: false,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(destination.price)).toBeInTheDocument();

    expect(screen.getByText(destination.tagline)).toBeInTheDocument();
  });
  it("Uses the correct destination image and alt text.", () => {
    const destination = destinations[0];

    render(
      <MemoryRouter>
        <DestinationCard destination={destination} />
      </MemoryRouter>,
    );

    const image = screen.getByRole("img", {
      name: `${destination.city}, ${destination.country}`,
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "alt",
      `${destination.city}, ${destination.country}`,
    );
  });

  it("Links to /destination/:slug.", () => {
    const destination = destinations[0];
    render(
      <MemoryRouter>
        <DestinationCard destination={destination} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", {
      name: /Explore city/i,
    });
    expect(link).toHaveAttribute("href", `/destination/${destination.slug}`);
  });
});
