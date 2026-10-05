import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { destinations } from "../../data/destinations";
import { ExplorePage } from "../../pages/ExplorePage";

describe("ExplorePage", () => {
  it("displays all curated destinations initially", () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );

    const destinaionNames = destinations.map((destination) => destination.city);

    for (const destinationName of destinaionNames) {
      expect(
        screen.getByRole("heading", { name: destinationName }),
      ).toBeInTheDocument();
    }
  });

  it("Filters destinations by Culture", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Culture" }));

    const culturalDestinations = destinations.filter((destination) =>
      destination.styles.includes("Culture"),
    );
    const otherDestinations = destinations.filter(
      (destination) => !destination.styles.includes("Culture"),
    );

    for (const cultureDestination of culturalDestinations) {
      expect(
        screen.getByRole("heading", { name: cultureDestination.city }),
      ).toBeInTheDocument();
    }

    for (const otherDestination of otherDestinations) {
      expect(
        screen.queryByRole("heading", { name: otherDestination.city }),
      ).not.toBeInTheDocument();
    }
  });

  it("Filters destinations by Nature", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Nature" }));

    const natureDestinations = destinations.filter((destination) =>
      destination.styles.includes("Nature"),
    );
    const otherDestinations = destinations.filter(
      (destination) => !destination.styles.includes("Nature"),
    );

    for (const natureDestination of natureDestinations) {
      expect(
        screen.getByRole("heading", { name: natureDestination.city }),
      ).toBeInTheDocument();
    }

    for (const otherDestination of otherDestinations) {
      expect(
        screen.queryByRole("heading", { name: otherDestination.city }),
      ).not.toBeInTheDocument();
    }
  });

  it("Filters destinations by Food", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Food" }));

    const foodDestinations = destinations.filter((destination) =>
      destination.styles.includes("Food"),
    );
    const otherDestinations = destinations.filter(
      (destination) => !destination.styles.includes("Food"),
    );

    for (const foodDestination of foodDestinations) {
      expect(
        screen.getByRole("heading", { name: foodDestination.city }),
      ).toBeInTheDocument();
    }

    for (const otherDestination of otherDestinations) {
      expect(
        screen.queryByRole("heading", { name: otherDestination.city }),
      ).not.toBeInTheDocument();
    }
  });

  it("Filters destinations by Coast", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Coast" }));

    const coastDestinations = destinations.filter((destination) =>
      destination.styles.includes("Coast"),
    );
    const otherDestinations = destinations.filter(
      (destination) => !destination.styles.includes("Coast"),
    );
    for (const coastDestination of coastDestinations) {
      expect(
        screen.getByRole("heading", { name: coastDestination.city }),
      ).toBeInTheDocument();
    }

    for (const otherDestination of otherDestinations) {
      expect(
        screen.queryByRole("heading", { name: otherDestination.city }),
      ).not.toBeInTheDocument();
    }
  });

  it("Restores all destinations when All is selected", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "All" }));

    const allDestinations = destinations;

    for (const allDestination of allDestinations) {
      expect(
        screen.getByRole("heading", { name: allDestination.city }),
      ).toBeInTheDocument();
    }
  });

  it("Links destination cards to their detail pages.", () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );

    for (const destination of destinations) {
      const heading = screen.getByRole("heading", { name: destination.city });

      const card = heading.closest("article");

      expect(card).not.toBeNull();
      const link = within(card as HTMLElement).getByRole("link", {
        name: /Explore city/i,
      });

      expect(link).toHaveAttribute("href", `/destination/${destination.slug}`);
    }
  });

  it("should render a card for each destination", async () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );

    const destinations = screen.getAllByRole("heading");

    expect(destinations.length).toBe(destinations.length);
  });

  it("Renders the live city search component", () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("textbox", { name: /Search any city/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Search the world/i }),
    ).toBeInTheDocument();
  });
});
