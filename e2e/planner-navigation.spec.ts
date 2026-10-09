import { expect, test } from "@playwright/test";

test("displays the correct number of trip days", async ({ page }) => {
  await page.goto("/planner");

  const tripDays = page.getByRole("tablist", { name: "Trip days" });
  const dayTabs = tripDays.getByRole("tab");

  await expect(dayTabs).toHaveCount(5);

  for (const day of [1, 2, 3, 4, 5]) {
    await expect(
      tripDays.getByRole("tab", { name: new RegExp(`^Day ${day}\\b`) }),
    ).toBeVisible();
  }
});

test("navigates back to the trip page from the planner", async ({ page }) => {
  await page.goto("/planner");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Kyoto, day by day.",
    }),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "My trip" })
    .click();

  await expect(page).toHaveURL(/\/trip$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Kyoto is calling.",
    }),
  ).toBeVisible();
});

test("Displays the correct number of trip days.", async ({ page }) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", { name: "Trip days" });

  const dayoneTab = tripDays.getByRole("tab", { name: /Day 1/i });
  await dayoneTab.click();

  await expect(dayoneTab).toHaveAttribute("aria-selected", "true");

  await expect(page.getByText("2 plans")).toBeVisible();

  const activityCards = page.getByRole("article");

  await expect(activityCards).toHaveCount(2);

  const activites = [
    {
      id: "a1",
      day: 1,
      time: "09:00",
      title: "Fushimi Inari sunrise walk",
      category: "Sightseeing",
      location: "Fushimi Ward",
      cost: 0,
    },
    {
      id: "a2",
      day: 1,
      time: "13:00",
      title: "Nishiki Market tasting",
      category: "Food",
      location: "Nakagyo Ward",
      cost: 45,
    },
  ];

  for (const activity of activites) {
    const activityCard = activityCards.filter({
      has: page.getByRole("heading", {
        level: 3,
        name: activity.title,
      }),
    });
    await expect(activityCard).toHaveCount(1);
    await expect(activityCard).toContainText(activity.time);
    await expect(activityCard).toContainText(activity.location);
    await expect(activityCard).toContainText(activity.category);
  }
});

test("Changes activities when another day is selected.", async ({ page }) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", {
    name: "Trip days",
  });
  await expect(tripDays).toBeVisible();
  const dayTab = tripDays.getByRole("tab");

  const activities = [
    {
      id: "a1",
      day: 1,
      time: "09:00",
      title: "Fushimi Inari sunrise walk",
      category: "Sightseeing",
      location: "Fushimi Ward",
      cost: 0,
    },
    {
      id: "a2",
      day: 1,
      time: "13:00",
      title: "Nishiki Market tasting",
      category: "Food",
      location: "Nakagyo Ward",
      cost: 45,
    },
    {
      id: "a3",
      day: 2,
      time: "10:30",
      title: "Arashiyama bamboo grove",
      category: "Nature",
      location: "Arashiyama",
      cost: 18,
    },
  ];

  await expect(dayTab).toHaveCount(5);

  for (const day of [1, 2]) {
    const dayTab = tripDays.getByRole("tab", {
      name: new RegExp(`^Day ${day}\\b`, "i"),
    });

    await dayTab.click();
    await expect(dayTab).toHaveAttribute("aria-selected", "true");

    const expectedActivities = activities.filter(
      (activity) => activity.day === day,
    );

    const activityCards = page.locator("article");

    await expect(activityCards).toHaveCount(expectedActivities.length);

    for (const activity of expectedActivities) {
      const activityCard = activityCards.filter({
        has: page.getByRole("heading", {
          level: 3,
          name: activity.title,
          exact: true,
        }),
      });

      await expect(activityCard).toHaveCount(1);

      await expect(
        activityCard.getByText(activity.location, { exact: true }),
      ).toBeVisible();

      await expect(
        activityCard.getByText(activity.category, { exact: true }),
      ).toBeVisible();
    }
  }
});

test("Opens the add-activity modal.", async ({ page }) => {
  await page.goto("/planner");
  const addActivityButton = page.getByRole("button", { name: "Add activity" });
  await expect(addActivityButton).toBeVisible();
  await addActivityButton.click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Add an activity",
    }),
  ).toBeVisible();
});

test("Rejects an activity without a name.", async ({ page }) => {
  await page.goto("/planner");
  const addActivityButton = page.getByRole("button", { name: "Add activity" });
  await expect(addActivityButton).toBeVisible();
  await addActivityButton.click();
  await page.getByLabel("Activity name").fill("");
  await page.getByRole("button", { name: "Add to itinerary" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Add an activity",
    }),
  ).toBeVisible();
});

test("Rejects an activity without a location.", async ({ page }) => {
  await page.goto("/planner");
  const addActivityButton = page.getByRole("button", { name: "Add activity" });
  await expect(addActivityButton).toBeVisible();
  await addActivityButton.click();
  await page.getByLabel("Activity name").fill("Test activity");
  await page.getByLabel("Location").fill("");
  await page.getByRole("button", { name: "Add to itinerary" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Add an activity",
    }),
  ).toBeVisible();
});

test("Adds a valid activity to the selected day.", async ({ page }) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", { name: "Trip days" });
  await expect(tripDays).toBeVisible();
  const dayTab = tripDays.getByRole("tab", {
    name: /Day 1/i,
  });
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const addActivityButton = page.getByRole("button", { name: "Add activity" });
  await expect(addActivityButton).toBeVisible();
  await addActivityButton.click();
  await page.getByLabel("Activity name").fill("Test activity");
  await page.getByLabel("Location").fill("Test location");
  await page.getByLabel("Category").selectOption("Sightseeing");
  await page.getByLabel("Estimated cost").fill("10");
  await page.getByLabel("Time").fill("10:00");
  await page.getByRole("button", { name: "Add to itinerary" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activities = page.getByRole("article");
  await expect(activities).toHaveCount(3);
  await expect(activities.getByText("Test activity")).toBeVisible();
});

test("Opens an existing activity for editing.", async ({ page }) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", { name: "Trip days" });
  await expect(tripDays).toBeVisible();
  const dayTab = tripDays.getByRole("tab", {
    name: /Day 1/i,
  });
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activityCards = page.getByRole("article");
  const activityCard = activityCards.filter({
    has: page.getByRole("heading", {
      level: 3,
      name: /Fushimi Inari sunrise walk/i,
    }),
  });

  await expect(activityCard).toHaveCount(1);
  await expect(activityCard).toContainText(/Fushimi Inari sunrise walk/i);

  const editButton = activityCard.getByRole("button", {
    name: /Edit Fushimi Inari sunrise walk/i,
  });
  await expect(editButton).toBeVisible();
  await editButton.click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Edit activity",
    }),
  ).toBeVisible();
});

test("Updates an activity.", async ({ page }) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", { name: "Trip days" });
  await expect(tripDays).toBeVisible();
  const dayTab = tripDays.getByRole("tab", {
    name: /Day 1/i,
  });
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activityCards = page.getByRole("article");
  const activityCard = activityCards.filter({
    has: page.getByRole("heading", {
      level: 3,
      name: /Fushimi Inari sunrise walk/i,
    }),
  });
  await expect(activityCard).toHaveCount(1);
  await expect(activityCard).toContainText(/Fushimi Inari sunrise walk/i);
  const editButton = activityCard.getByRole("button", {
    name: /Edit Fushimi Inari sunrise walk/i,
  });
  await expect(editButton).toBeVisible();
  await editButton.click();
  await page.getByLabel("Activity name").fill("Test activity");
  await page.getByLabel("Location").fill("Test location");
  await page.getByLabel("Category").selectOption("Sightseeing");
  await page.getByLabel("Estimated cost").fill("10");
  await page.getByLabel("Time").fill("10:00");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activities = page.getByRole("article");
  await expect(activities).toHaveCount(2);
  await expect(activities.getByText("Test activity")).toBeVisible();
  await expect(
    activities.getByText("Fushimi Inari sunrise walk"),
  ).not.toBeVisible();
});

test("Moves an activity to another day.", async ({ page }) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", { name: "Trip days" });
  await expect(tripDays).toBeVisible();
  const dayTab = tripDays.getByRole("tab", {
    name: /Day 1/i,
  });
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activityCards = page.getByRole("article");
  const activityCard = activityCards.filter({
    has: page.getByRole("heading", {
      level: 3,
      name: /Fushimi Inari sunrise walk/i,
    }),
  });
  await expect(activityCard).toHaveCount(1);
  await expect(activityCard).toContainText(/Fushimi Inari sunrise walk/i);
  const editButton = activityCard.getByRole("button", {
    name: /Edit Fushimi Inari sunrise walk/i,
  });
  await expect(editButton).toBeVisible();
  await editButton.click();
  const editDialog = page.getByRole("dialog");
  await editDialog
    .getByRole("combobox", { name: "Day", exact: true })
    .selectOption({ label: "Day 2" });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activities = page.getByRole("article");
  await expect(activities).toHaveCount(1);
  await expect(
    activities.getByText("Fushimi Inari sunrise walk"),
  ).not.toBeVisible();

  const dayTwoTab = tripDays.getByRole("tab", {
    name: /Day 2/i,
  });
  await dayTwoTab.click();
  await expect(dayTwoTab).toHaveAttribute("aria-selected", "true");
  const dayTwoActivityCards = page.getByRole("article");
  await expect(dayTwoActivityCards).toHaveCount(2);
  const theActivityCard = dayTwoActivityCards.filter({
    has: page.getByRole("heading", {
      level: 3,
      name: /Fushimi Inari sunrise walk/i,
    }),
  });
  await expect(theActivityCard).toHaveCount(1);
  await expect(theActivityCard).toContainText(/Fushimi Inari sunrise walk/i);
});

test("Deletes an activity.", async ({ page }) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", { name: "Trip days" });
  await expect(tripDays).toBeVisible();
  const dayTab = tripDays.getByRole("tab", {
    name: /Day 1/i,
  });
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activityCards = page.getByRole("article");
  const activityCard = activityCards.filter({
    has: page.getByRole("heading", {
      level: 3,
      name: /Fushimi Inari sunrise walk/i,
    }),
  });
  await expect(activityCard).toHaveCount(1);
  await expect(activityCard).toContainText(/Fushimi Inari sunrise walk/i);

  const deleteButton = activityCard.getByRole("button", {
    name: /Delete Fushimi Inari sunrise walk/i,
  });
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  const activities = page.getByRole("article");
  await expect(activities).toHaveCount(1);
  await expect(
    activities.getByText("Fushimi Inari sunrise walk"),
  ).not.toBeVisible();
});

test("Shows the empty state when a day has no activities.", async ({
  page,
}) => {
  await page.goto("/planner");
  const tripDays = page.getByRole("tablist", { name: "Trip days" });
  await expect(tripDays).toBeVisible();
  const dayTab = tripDays.getByRole("tab", {
    name: /Day 5/i,
  });
  await dayTab.click();
  await expect(dayTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("A wide-open day")).toBeVisible();
});

test("Links back to the destination guide.", async ({ page }) => {
  await page.goto("/planner");
  const link = page.getByRole("link", {
    name: "Destination guide",
    exact: true,
  });

  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/destination/kyoto-japan");
  await link.click();
  await expect(page).toHaveURL(/\/destination\/kyoto-japan$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Kyoto", exact: true }),
  ).toBeVisible();
});
