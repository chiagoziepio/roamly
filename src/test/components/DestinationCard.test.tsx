import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import { DestinationCard } from "../../components/DestinationCard";
import { destinations } from "../../data/destinations";

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="current-location">{location.pathname}</div>;
}

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

  it("Applies the featured layout when featured is true.", () => {
    const destination = destinations[0];
    render(
      <MemoryRouter>
        <DestinationCard destination={destination} featured={true} />
      </MemoryRouter>,
    );

    const card = screen.getByRole("article");
    const heading = screen.getByRole("heading", {
      name: destination.city,
    });

    expect(card).toHaveClass("min-h-136", "md:col-span-2");
    expect(card).not.toHaveClass("min-h-108");
    expect(heading).toHaveClass("text-5xl", "md:text-6xl");
    expect(heading).not.toHaveClass("text-4xl");
  });

  it("Clicking the save button does not navigate.", async () => {
    const destination = destinations[0];
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/explore"]}>
        <DestinationCard destination={destination} />
        <LocationDisplay />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/explore",
    );

    await user.click(
      screen.getByRole("button", {
        name: `Save ${destination.city}`,
      }),
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/explore",
    );
  });
});
