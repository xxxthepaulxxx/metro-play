import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useBlindBoxStore } from "../../stores/blindBox";
import { useWalletStore } from "../../stores/wallet";
import ScanMerchantView from "./ScanMerchantView.vue";

vi.mock("../../api/mockApi", () => ({
  purchaseBox: vi.fn(),
  rerollBox: vi.fn(),
  scanStation: vi.fn(),
  scanMerchant: vi.fn().mockResolvedValue({
    verified: true,
    discountText: "溫泉湯屋85折",
    bonusPoints: 100,
  }),
}));

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/blind-box", component: { template: "<div />" } },
      { path: "/blind-box/scan-station", component: { template: "<div />" } },
      { path: "/blind-box/scan-merchant", component: { template: "<div />" } },
    ],
  });
}

const MOCK_DEST = {
  id: "dest-001",
  name: "北投溫泉",
  station: "新北投",
  description: "享受台北最著名的天然溫泉鄉",
  merchantCode: "MERCH-BEITOU-001",
  discountText: "溫泉湯屋85折",
  bonusPoints: 100,
};

function seedStore(stationVerified = true) {
  const store = useBlindBoxStore();
  store.activeBox.id = "box-test";
  store.activeBox.destination = { ...MOCK_DEST };
  store.activeBox.stationVerified = stationVerified;
  store.activeBox.merchantVerified = false;
  store.reward = { done: false, discountActivated: false, bonusPoints: 0 };
  return store;
}

describe("ScanMerchantView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // ── e2e.1: Happy path — merchant scan → reward claim ───────────────────

  it("shows merchant name and discount", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("北投溫泉");
    expect(wrapper.text()).toContain("溫泉湯屋85折");
  });

  it("shows scan button before verification", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".scan-btn").exists()).toBe(true);
    expect(wrapper.text()).toContain("模擬掃描");
  });

  it("sets merchantVerified and populates reward after scan", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = seedStore();
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    expect(store.activeBox.merchantVerified).toBe(true);
    expect(store.reward.bonusPoints).toBe(100);
    expect(store.reward.discountActivated).toBe(true);
  });

  it("shows reward card with points and discount after scan", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find(".reward-card").exists()).toBe(true);
    expect(wrapper.text()).toContain("+100 捷點");
    expect(wrapper.find(".claim-btn").exists()).toBe(true);
  });

  it("credits wallet and shows celebration after claiming reward", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = seedStore();
    const wallet = useWalletStore();
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    const balanceBefore = wallet.balance;
    await wrapper.find(".claim-btn").trigger("click");
    expect(store.reward.done).toBe(true);
    expect(wallet.balance).toBe(balanceBefore + 100);
    expect(wrapper.find(".celebration-card").exists()).toBe(true);
    expect(wrapper.text()).toContain("旅程完成");
  });

  it("shows 返回首頁 link on celebration screen", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore();
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".scan-btn").trigger("click");
    await flushPromises();
    await wrapper.find(".claim-btn").trigger("click");
    const homeLink = wrapper.find("a.home-btn");
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.attributes("href")).toContain("/blind-box");
  });

  // ── e2e.2: Guard — station must be verified before merchant scan ────────

  it("shows station-required guard when stationVerified is false", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(false); // stationVerified = false
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".station-required").exists()).toBe(true);
    expect(wrapper.text()).toContain("請先完成車站打卡");
    expect(wrapper.find(".scan-btn").exists()).toBe(false);
  });

  it("station-required guard shows link to scan-station", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(false);
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    const link = wrapper.find("a.cta-button");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toContain("scan-station");
  });

  it("shows no-box fallback when activeBox.id is null", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useBlindBoxStore(); // fresh — no active box
    const wrapper = mount(ScanMerchantView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".no-box").exists()).toBe(true);
    expect(wrapper.text()).toContain("尚未購買盲盒");
  });
});
