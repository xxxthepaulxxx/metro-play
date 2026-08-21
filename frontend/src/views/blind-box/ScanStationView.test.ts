import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useBlindBoxStore } from "../../stores/blindBox";
import ScanStationView from "./ScanStationView.vue";

vi.mock("../../stores/blindBox", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../stores/blindBox")>();
  return {
    ...actual,
    // We'll override per-test via store instance; no factory mock needed
  };
});

// Mock the API so verifyStation resolves immediately
vi.mock("../../api/mockApi", () => ({
  purchaseBox: vi.fn(),
  rerollBox: vi.fn(),
  scanStation: vi.fn().mockResolvedValue({ verified: true }),
  scanMerchant: vi.fn(),
}));

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/blind-box", component: { template: "<div />" } },
      { path: "/blind-box/reveal", component: { template: "<div />" } },
      { path: "/blind-box/scan-station", component: { template: "<div />" } },
      { path: "/blind-box/scan-merchant", component: { template: "<div />" } },
    ],
  });
}

function seedStore() {
  const store = useBlindBoxStore();
  store.activeBox.id = "box-test";
  store.activeBox.destination = {
    id: "dest-001",
    name: "北投溫泉",
    station: "新北投",
    description: "享受台北最著名的天然溫泉鄉",
    merchantCode: "MERCH-BEITOU-001",
    discountText: "溫泉湯屋85折",
    bonusPoints: 100,
  };
  store.activeBox.stationVerified = false;
  return store;
}

describe("ScanStationView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows destination station name", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanStationView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("新北投");
    expect(wrapper.text()).toContain("北投溫泉");
  });

  it("shows scan button before verification", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanStationView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".scan-btn").exists()).toBe(true);
    expect(wrapper.text()).toContain("模擬掃描");
  });

  it("sets stationVerified on scan button click", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = seedStore();
    const wrapper = mount(ScanStationView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    expect(store.activeBox.stationVerified).toBe(true);
  });

  it("shows success state after verification", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanStationView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find(".success-label").exists()).toBe(true);
    expect(wrapper.text()).toContain("車站打卡成功");
  });

  it("shows 前往商家打卡 link after verification", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanStationView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    const link = wrapper.find("a.cta-button");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toContain("scan-merchant");
  });

  it("hides scan button after verification", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanStationView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find(".scan-btn").exists()).toBe(false);
  });

  it("shows no-box fallback when activeBox.id is null", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useBlindBoxStore(); // fresh store, activeBox.id is null
    const wrapper = mount(ScanStationView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("尚未購買盲盒");
    expect(wrapper.find(".scan-btn").exists()).toBe(false);
  });
});
