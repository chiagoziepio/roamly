import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { TripProvider } from "../../context/TripContext";
import { destinations } from "../../data/destinations";
import { PlannerPage } from "../../pages/PlannerPage";
import { TripPage } from "../../pages/TripPage";

describe("TripPage", () => {
  it("Displays the active destination, dates, and traveler count", () => {
    const destination = destinations[0];
    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: `${destination.city} is calling.`,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/2026-11-12.*2026-11-16/)).toBeInTheDocument();

    expect(screen.getByText(/2 travelers/i)).toBeInTheDocument();
  });

  it("Calculates total expenses correctly.", () => {
    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "$1,920 of $3,200",
      }),
    ).toBeInTheDocument();
  });

  it("Calculates the remaining budget correctly.", () => {
    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/60% used/i)).toBeInTheDocument();
    expect(screen.getByText(/1,280 remaining/i)).toBeInTheDocument();
  });

  it("Progress bar is updated when expenses are added.", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /^expense$/i,
      }),
    );

    await user.type(
      screen.getByLabelText(/expense name/i),
      "Charity to locals",
    );

    await user.type(screen.getByLabelText(/amount/i), "100");

    await user.click(
      screen.getByRole("button", {
        name: /^add expense$/i,
      }),
    );

    const progressBar = screen.getByRole("progressbar", {
      name: /budget used/i,
    });

    expect(progressBar).toBeInTheDocument();

    expect(progressBar).toHaveAttribute("aria-valuenow", "63");
    expect(progressBar).toHaveStyle({ width: "63%" });
  });

  it("Caps the progress bar at 100%.", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    // Add an expense larger than the entire $3,200 budget.
    await user.click(
      screen.getByRole("button", {
        name: /^expense$/i,
      }),
    );

    await user.type(screen.getByLabelText(/expense name/i), "Hookup Fee");

    await user.type(screen.getByLabelText(/amount/i), "4000");

    await user.click(
      screen.getByRole("button", {
        name: /^add expense$/i,
      }),
    );

    const progressBar = screen.getByRole("progressbar", {
      name: /budget used/i,
    });

    expect(progressBar).toBeInTheDocument();

    expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    expect(progressBar).toHaveStyle({ width: "100%" });
  });

  it("Opens the expense modal.", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /expense/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Add an expense",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/expense name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add expense/i }),
    ).toBeInTheDocument();
  });

  it("Rejects an empty expense.", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /expense/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /add expense/i,
      }),
    );

    // The form stays open because submission was rejected.
    expect(
      screen.getByRole("dialog", {
        name: /add an expense/i,
      }),
    ).toBeInTheDocument();

    // No expense was added, so the total remains unchanged.
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "$1,920 of $3,200",
      }),
    ).toBeInTheDocument();
  });

  it("Rejects a zero or negative expense.", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /expense/i }));

    await user.type(
      screen.getByLabelText(/expense name/i),
      "Charity to locals",
    );

    await user.type(screen.getByLabelText(/amount/i), "-100");

    await user.click(
      screen.getByRole("button", {
        name: /add expense/i,
      }),
    );

    // The form stays open because submission was rejected.
    expect(
      screen.getByRole("dialog", {
        name: /add an expense/i,
      }),
    ).toBeInTheDocument();

    // No expense was added, so the total remains unchanged.
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "$1,920 of $3,200",
      }),
    ).toBeInTheDocument();
  });

  it("Toggles checklist items.", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    const firstChecklist = screen.getAllByRole("checklistLabel")[0];
    expect(firstChecklist).toBeInTheDocument();
    expect(firstChecklist).toHaveAttribute("aria-checked", "true");

    await user.click(firstChecklist);
    expect(firstChecklist).toHaveAttribute("aria-checked", "false");
    await user.click(firstChecklist);
    expect(firstChecklist).toHaveAttribute("aria-checked", "true");

    const checklistText = firstChecklist.querySelector("span");

    expect(checklistText).toHaveClass("line-through");
  });

  it("Updates the completed checklist count.", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    const checklistIndicatorSpan = screen.getByText("2/4");

    expect(checklistIndicatorSpan).toBeInTheDocument();

    const firstChecklist = screen.getAllByRole("checklistLabel")[0];
    expect(firstChecklist).toBeInTheDocument();

    await user.click(firstChecklist);
    expect(checklistIndicatorSpan).toHaveTextContent("1/4");

    const secondChecklist = screen.getAllByRole("checklistLabel")[1];
    expect(secondChecklist).toBeInTheDocument();
    await user.click(secondChecklist);
    expect(checklistIndicatorSpan).toHaveTextContent("2/4");
  });

  it("Opens and closes booking details.", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    const bookingDetailsButton = screen.getByRole("button", {
      name: /booking details/i,
    });
    expect(bookingDetailsButton).toBeInTheDocument();

    await user.click(bookingDetailsButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "The essentials",
      }),
    ).toBeInTheDocument();

    const modaLcloseButton = screen.getByRole("button", {
      name: /close modal/i,
    });

    expect(modaLcloseButton).toBeInTheDocument();

    await user.click(modaLcloseButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Displays the number of activities planned per day", () => {
    render(
      <MemoryRouter>
        <TripProvider>
          <TripPage />
        </TripProvider>
      </MemoryRouter>,
    );

    const expected = [
      ["Day 1", "2 plans"],
      ["Day 2", "1 plans"],
      ["Day 3", "0 plans"],
    ];
    expected.forEach(([day, activityCount]) => {
      const dayCard = screen.getByText(day).closest("div");

      expect(dayCard).not.toBeNull();
      expect(within(dayCard!).getByText(activityCount)).toBeInTheDocument();
    });
  });

  it("Links to the Planner page.", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/trip"]}>
        <TripProvider>
          <Routes>
            <Route path="/trip" element={<TripPage />} />
            <Route path="/planner" element={<PlannerPage />} />
          </Routes>
        </TripProvider>
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link", {
      name: /navigate to planner page/i,
    });

    links.forEach((link) => {
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/planner");
    });

    const firstLink = links[0];

    expect(firstLink).toBeInTheDocument();
    await user.click(firstLink);
    expect(
      screen.queryByRole("heading", {
        level: 1,
        name: "Kyoto is calling.",
      }),
    ).not.toBeInTheDocument();
  });
});
