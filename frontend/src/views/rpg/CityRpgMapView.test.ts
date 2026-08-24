import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { DISTRICTS } from "../../api/mockData";
import { useCityRpgStore } from "../../stores/cityRpg";
import CityRpgMapView from "./CityRpgMapView.vue";

vi.mock("../../api/mockApi", async (importOriginal) => {
  const real = await importOriginal<typeof import("../../api/mockApi")>();
  return { ...real, fetchDistricts: vi.fn().mockResolvedValue(DISTRICTS) };
});

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/rpg", component: { template: "<div />" } },
      { path: "/rpg/district/:id", component: { template: "<div />" } },
    ],
  });
}

describe("CityRpgMapView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // e2e.1 — Scenario 1: mixed state (信義探險區 3/4, 大安文青區 fully unlocked)
  it("renders 6 DistrictCards with locked and unlocked states", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    // Seed: xinyi 3/4 visited (not unlocked), daan 5/5 visited (unlocked) + claimed
    store.visitedStationIds = new Set([
      "xinyi-city-hall",
      "xinyi-taipei-101",
      "xinyi-xiangshan",
      "daan-daan",
      "daan-technology-building",
      "daan-liuzhangli",
      "daan-xinhai",
      "daan-muzha",
    ]);
    store.claimedDistrictBonuses = new Set(["daan"]);

    const wrapper = mount(CityRpgMapView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await flushPromises();

    const cards = wrapper.findAll("button");
    expect(cards).toHaveLength(DISTRICTS.length); // 6

    const unlockedCards = cards.filter((c) => c.classes().includes("unlocked"));
    const lockedCards = cards.filter((c) => c.classes().includes("locked"));
    expect(unlockedCards.length).toBeGreaterThanOrEqual(1);
    expect(lockedCards.length).toBeGreaterThanOrEqual(1);
  });

  it("overall progress hero shows 1/6 for mixed state", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    store.visitedStationIds = new Set([
      "xinyi-city-hall",
      "xinyi-taipei-101",
      "xinyi-xiangshan",
      "daan-daan",
      "daan-technology-building",
      "daan-liuzhangli",
      "daan-xinhai",
      "daan-muzha",
    ]);
    store.claimedDistrictBonuses = new Set(["daan"]);

    const wrapper = mount(CityRpgMapView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await flushPromises();

    const hero = wrapper.find("[aria-label='overall progress']");
    expect(hero.text()).toContain("1");
    expect(hero.text()).toContain("6");
    expect(hero.text()).toContain("+50 pts"); // daan bonus claimed
  });

  // e2e.2 — Scenario 5: all districts unlocked
  it("shows all 6 cards as unlocked when all districts are at threshold", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    // Seed all districts fully visited and claimed
    const allStations = DISTRICTS.flatMap((d) => d.stations.map((s) => s.id));
    store.visitedStationIds = new Set(allStations);
    store.claimedDistrictBonuses = new Set(DISTRICTS.map((d) => d.id));

    const wrapper = mount(CityRpgMapView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await flushPromises();

    const cards = wrapper.findAll("button");
    expect(cards).toHaveLength(DISTRICTS.length);
    for (const card of cards) {
      expect(card.classes()).toContain("unlocked");
    }

    const hero = wrapper.find("[aria-label='overall progress']");
    expect(hero.text()).toContain("6");
    // No lock icons
    expect(wrapper.text()).not.toContain("🔒");
  });

  it("overall progress shows 6/6 when all unlocked", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    const allStations = DISTRICTS.flatMap((d) => d.stations.map((s) => s.id));
    store.visitedStationIds = new Set(allStations);
    store.claimedDistrictBonuses = new Set(DISTRICTS.map((d) => d.id));

    const wrapper = mount(CityRpgMapView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await flushPromises();

    const totalBonus = DISTRICTS.reduce((sum, d) => sum + d.bonusPoints, 0);
    const hero = wrapper.find("[aria-label='overall progress']");
    expect(hero.text()).toContain(`+${totalBonus} pts`);
  });

  it("tapping a DistrictCard navigates to /rpg/district/:id", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useCityRpgStore();

    const router = makeRouter();
    await router.push("/rpg");

    const wrapper = mount(CityRpgMapView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();

    const firstCard = wrapper.find("button");
    await firstCard.trigger("click");
    await flushPromises();

    expect(router.currentRoute.value.path).toMatch(/^\/rpg\/district\//);
  });
});
