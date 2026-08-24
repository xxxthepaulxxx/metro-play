import { expect, test } from "@playwright/test";

// 信義探險區: 3/4 visited; 大安文青區: fully unlocked (5/5, claimed)
const XINYI_3OF4_STATE = JSON.stringify({
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

// 信義探險區 fully unlocked (4/4, claimed); 大安文青區 still unlocked → 2/6 total
const XINYI_UNLOCKED_STATE = JSON.stringify({
  visitedStationIds: [
    "xinyi-city-hall",
    "xinyi-taipei-101",
    "xinyi-xiangshan",
    "xinyi-sun-yat-sen",
    "daan-daan",
    "daan-technology-building",
    "daan-liuzhangli",
    "daan-xinhai",
    "daan-muzha",
  ],
  claimedDistrictBonuses: ["daan", "xinyi"],
});

// e2e.1 — Scenario 3: trigger district unlock
test("Scenario 3: tapping 模擬進站 at threshold triggers unlock animation and credits bonus", async ({
  page,
}) => {
  await page.addInitScript((state) => {
    localStorage.setItem("city-rpg-store", state);
  }, XINYI_3OF4_STATE);

  await page.goto("/rpg/district/xinyi");

  // Button shows next unvisited station: 國父紀念館 (xinyi-sun-yat-sen)
  const btn = page.locator(".visit-btn");
  await expect(btn).toContainText("模擬進站");
  await expect(btn).toContainText("國父紀念館");

  // Tap the button to record the 4th visit (crosses threshold of 4)
  await btn.click();

  // Progress label updates to 4 / 4
  await expect(page.locator(".progress-count")).toContainText("4 / 4");

  // Station row for 國父紀念館 flips to visited
  const sunYatSenRow = page.locator(".station-row", { hasText: "國父紀念館" });
  await expect(sunYatSenRow).toHaveClass(/visited/);

  // Unlock animation fires
  await expect(page.locator(".unlock-burst")).toBeVisible();

  // 已解鎖 badge appears on the card
  await expect(page.locator(".unlock-badge")).toBeVisible();

  // Wallet balance increases by 50 pts (xinyi bonusPoints)
  const walletBalance = await page.evaluate(() => {
    const raw = localStorage.getItem("wallet-store");
    if (!raw) return null;
    return (JSON.parse(raw) as { balance: number }).balance;
  });
  // Default wallet starts at 500; after claiming 50 pts → 550
  expect(walletBalance).toBe(550);

  // Animation disappears after the timer fires (≤ 2 s)
  await expect(page.locator(".unlock-burst")).not.toBeVisible({ timeout: 2000 });
});

// e2e.2 — Scenario 4: return to map after unlock
test("Scenario 4: returning to adventure map shows updated unlocked state", async ({ page }) => {
  await page.addInitScript((state) => {
    localStorage.setItem("city-rpg-store", state);
  }, XINYI_UNLOCKED_STATE);

  // Start on the detail page to simulate coming back from the unlock flow
  await page.goto("/rpg/district/xinyi");

  // Tap the back button
  await page.locator("[aria-label='返回冒險地圖']").click();
  await expect(page).toHaveURL(/\/rpg$/);

  // 信義探險區 card is now unlocked
  const xinyiCard = page.locator(".district-card", { hasText: "信義探險區" });
  await expect(xinyiCard).toHaveClass(/unlocked/);

  // Overall progress hero reflects 2 / 6 unlocked
  const hero = page.locator("[aria-label='overall progress']");
  await expect(hero).toContainText("2");
  await expect(hero).toContainText("6");

  // No animation replays on the map
  await expect(page.locator(".unlock-burst")).not.toBeVisible();
});
