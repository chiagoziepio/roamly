import { expect, test } from "@playwright/test";

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
