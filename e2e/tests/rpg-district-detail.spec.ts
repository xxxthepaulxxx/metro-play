import { expect, test } from "@playwright/test";

const MIXED_STATE = JSON.stringify({
  visitedStationIds: [
    "xinyi-city-hall",
    "xinyi-taipei-101",
    "xinyi-xiangshan",
    "daan-daan",
    "daan-technology-building",
    "daan-liuzhangli",
    "daan-xinhai",
    "daan-muzha",
  ],
  claimedDistrictBonuses: ["daan"],
});

// e2e.1 — Scenario 2: view district detail
test("Scenario 2: tap 信義探險區 → detail view shows station checklist", async ({ page }) => {
  await page.addInitScript((state) => {
    localStorage.setItem("city-rpg-store", state);
  }, MIXED_STATE);

  await page.goto("/rpg");

  // Tap the first card (xinyi — first in DISTRICTS order)
  const firstCard = page.locator(".district-card").first();
  await expect(firstCard).toContainText("信義探險區");
  await firstCard.click();

  // Route changed to district detail
  await expect(page).toHaveURL(/\/rpg\/district\/xinyi/);

  // Station list shows all 6 stations
  await expect(page.locator(".station-row")).toHaveCount(6);

  // 3 visited (amber ✓), 3 unvisited
  await expect(page.locator(".station-row.visited")).toHaveCount(3);
  await expect(page.locator(".station-row.unvisited")).toHaveCount(3);

  // Progress shows 3 / 4
  await expect(page.locator(".progress-count")).toContainText("3 / 4");

  // Bonus preview shows +50 pts
  await expect(page.locator(".bonus-preview")).toContainText("+50 pts");

  // No 已解鎖 badge (not yet unlocked — threshold 4, visited 3)
  await expect(page.locator(".unlock-badge")).toHaveCount(0);

  // Back link returns to /rpg
  await page.locator("[aria-label='返回冒險地圖']").click();
  await expect(page).toHaveURL(/\/rpg$/);
});
