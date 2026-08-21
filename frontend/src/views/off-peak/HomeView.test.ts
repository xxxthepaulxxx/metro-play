import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useOffPeakStore } from "../../stores/offPeak";
import { useWalletStore } from "../../stores/wallet";
import HomeView from "./HomeView.vue";

const OFF_PEAK_BANNER_STUB = { template: '<div class="off-peak-banner" />' };

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/off-peak", component: { template: "<div />" } },
      { path: "/off-peak/game-a", component: { template: "<div />" } },
      { path: "/off-peak/game-b", component: { template: "<div />" } },
    ],
  });
}

describe("HomeView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("displays balance via PointBadge", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useOffPeakStore();
    const wallet = useWalletStore();
    wallet.credit(734); // 500 + 734 = 1,234
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    expect(wrapper.text()).toContain("1,234");
  });

  it("shows OffPeakTimeBanner when window.start is set", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    expect(wrapper.find(".off-peak-banner").exists()).toBe(true);
  });

  it("shows 今日無離峰時段 when window.start is empty", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    store.offPeakWindow.start = "";
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    expect(wrapper.text()).toContain("今日無離峰時段");
    expect(wrapper.find(".off-peak-banner").exists()).toBe(false);
  });

  it("renders two GameCard components", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    expect(wrapper.findAll(".game-card")).toHaveLength(2);
  });

  it("shows 已承諾 badge when pledge is committed", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    store.pledge.committed = true;
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    expect(wrapper.text()).toContain("已承諾");
  });

  it("shows 前往 link to /off-peak/game-a when not committed", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    const links = wrapper.findAll("a");
    const gameALink = links.find((l) => l.attributes("href")?.includes("game-a"));
    expect(gameALink).toBeDefined();
  });

  it("shows 前往 link to /off-peak/game-b", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    const links = wrapper.findAll("a");
    const gameBLink = links.find((l) => l.attributes("href")?.includes("game-b"));
    expect(gameBLink).toBeDefined();
  });

  it("hides game-a 前往 link when pledge is committed", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    store.pledge.committed = true;
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, makeRouter()],
        stubs: { OffPeakTimeBanner: OFF_PEAK_BANNER_STUB },
      },
    });
    const links = wrapper.findAll("a");
    const gameALink = links.find((l) => l.attributes("href")?.includes("game-a"));
    expect(gameALink).toBeUndefined();
  });
});
