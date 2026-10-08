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
