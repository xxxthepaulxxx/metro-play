import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useCityRpgStore } from "../../stores/cityRpg";
import DistrictDetailView from "./DistrictDetailView.vue";

function makeRouter(initialPath = "/rpg/district/xinyi") {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/rpg", component: { template: "<div />" } },
      { path: "/rpg/district/:id", component: { template: "<div />" } },
    ],
  });
  router.push(initialPath);
  return router;
}

describe("DistrictDetailView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // e2e.1 — Scenario 2: view district detail for 信義探險區 (3/4 visited)
  it("shows district name and all 6 stations", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    store.visitedStationIds = new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]);
    const router = makeRouter();
    await router.isReady();

    const wrapper = mount(DistrictDetailView, {
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.text()).toContain("信義探險區");
    const rows = wrapper.findAll(".station-row");
    expect(rows).toHaveLength(6);
  });

  it("shows 3 visited and 3 unvisited stations", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    store.visitedStationIds = new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]);
    const router = makeRouter();
    await router.isReady();

    const wrapper = mount(DistrictDetailView, {
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.findAll(".station-row.visited")).toHaveLength(3);
    expect(wrapper.findAll(".station-row.unvisited")).toHaveLength(3);
  });

  it("shows progress bar at 3/4 (75%)", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    store.visitedStationIds = new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]);
    const router = makeRouter();
    await router.isReady();

    const wrapper = mount(DistrictDetailView, {
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.text()).toContain("3 / 4");
    const bar = wrapper.find("[role='progressbar']");
    expect(bar.attributes("aria-valuenow")).toBe("75");
  });

  it("shows bonus points preview +50 pts and no 已解鎖 badge", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    store.visitedStationIds = new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]);
    const router = makeRouter();
    await router.isReady();

    const wrapper = mount(DistrictDetailView, {
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.text()).toContain("+50 pts");
    expect(wrapper.text()).not.toContain("已解鎖");
  });

  it("shows 已解鎖 badge when district is at threshold", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useCityRpgStore();
    // Visit all 4 threshold stations
    store.visitedStationIds = new Set([
      "xinyi-city-hall",
      "xinyi-taipei-101",
      "xinyi-xiangshan",
      "xinyi-sun-yat-sen",
    ]);
    const router = makeRouter();
    await router.isReady();

    const wrapper = mount(DistrictDetailView, {
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.text()).toContain("已解鎖");
  });

  it("back link navigates to /rpg", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useCityRpgStore();
    const router = makeRouter();
    await router.isReady();

    const wrapper = mount(DistrictDetailView, {
      global: { plugins: [pinia, router] },
    });

    const back = wrapper.find("[aria-label='返回冒險地圖']");
    expect(back.exists()).toBe(true);
    expect(back.attributes("href")).toContain("rpg");
  });

  it("redirects to /rpg for an unknown district id", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useCityRpgStore();
    const router = makeRouter("/rpg/district/unknown-xyz");
    await router.isReady();

    mount(DistrictDetailView, {
      global: { plugins: [pinia, router] },
    });

    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/rpg");
  });
});
