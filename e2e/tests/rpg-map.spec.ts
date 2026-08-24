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

const ALL_UNLOCKED_STATE = JSON.stringify({
  visitedStationIds: [
    "xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan", "xinyi-sun-yat-sen",
    "daan-daan", "daan-technology-building", "daan-liuzhangli", "daan-xinhai", "daan-muzha",
    "zhongshan-zhongshan", "zhongshan-shuanglian", "zhongshan-xingtian",
    "beitou-beitou", "beitou-xinbeitou", "beitou-qilian",
    "banqiao-banqiao", "banqiao-jiangzicui", "banqiao-xinpu", "banqiao-tucheng",
    "tamsui-tamsui", "tamsui-hongshulin", "tamsui-zhuwei",
  ],
  claimedDistrictBonuses: ["xinyi", "daan", "zhongshan", "beitou", "banqiao", "tamsui"],
});

// e2e.1 — Scenario 1: view adventure map (mixed state)
test("Scenario 1: adventure map shows mixed locked/unlocked district cards", async ({ page }) => {
  await page.addInitScript((state) => {
    localStorage.setItem("city-rpg-store", state);
  }, MIXED_STATE);

  await page.goto("/rpg");

  // 6 district cards rendered
  const cards = page.locator(".district-card");
  await expect(cards).toHaveCount(6);

  // At least one locked and one unlocked
  await expect(page.locator(".district-card.unlocked")).toHaveCount(1);
  await expect(page.locator(".district-card.locked")).toHaveCount(5);

  // Overall progress hero shows 1 / 6
  const hero = page.locator("[aria-label='overall progress']");
  await expect(hero).toContainText("1");
  await expect(hero).toContainText("6");
  await expect(hero).toContainText("+50 pts");
});

// e2e.2 — Scenario 5: all districts already unlocked
test("Scenario 5: all districts unlocked shows 6/6 with no lock icons", async ({ page }) => {
  await page.addInitScript((state) => {
    localStorage.setItem("city-rpg-store", state);
  }, ALL_UNLOCKED_STATE);

  await page.goto("/rpg");

  const cards = page.locator(".district-card");
  await expect(cards).toHaveCount(6);

  // All unlocked — no locked cards
  await expect(page.locator(".district-card.locked")).toHaveCount(0);
  await expect(page.locator(".district-card.unlocked")).toHaveCount(6);

  // No lock icons
  await expect(page.locator(".lock-icon")).toHaveCount(0);

  // Overall progress shows 6/6
  const hero = page.locator("[aria-label='overall progress']");
  await expect(hero).toContainText("6");
});
