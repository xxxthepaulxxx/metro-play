import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useOffPeakStore } from "../stores/offPeak";
import SettlementOverlay from "./SettlementOverlay.vue";

const COMBO_STUB = {
  template: '<div class="combo-bonus-stub" />',
  props: ["pledgeReward", "guessReward", "totalReward"],
};

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [{ path: "/off-peak", component: { template: "<div />" } }],
  });
}

function settlementStore(overrides: Partial<ReturnType<typeof useOffPeakStore>> = {}) {
  const store = useOffPeakStore();
  store.settlement.done = true;
  store.settlement.totalReward = 150;
  store.settlement.pledgeReward = 150;
  store.settlement.guessReward = 0;
  store.settlement.combo = false;
  Object.assign(store, overrides);
  return store;
}

describe("SettlementOverlay", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("does not render when settlement is not done", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.find(".overlay-backdrop").exists()).toBe(false);
  });

  it("renders overlay when settlement is done", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    settlementStore();
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.find(".overlay-backdrop").exists()).toBe(true);
  });

  it("shows pledge hit row with positive points", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = settlementStore();
    store.pledge.committed = true;
    store.pledge.staked = 50;
    store.pledge.outcome = "success";
    store.settlement.pledgeReward = 150;
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.text()).toContain("命中 ✓");
    expect(wrapper.text()).toContain("+150 捷點");
  });

  it("shows pledge miss row with negative points", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = settlementStore();
    store.pledge.committed = true;
    store.pledge.staked = 50;
    store.pledge.outcome = "forfeit";
    store.settlement.pledgeReward = 0;
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.text()).toContain("未命中 ✗");
    expect(wrapper.text()).toContain("−50 捷點");
  });

  it("shows guess correct row", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = settlementStore();
    store.prediction.submitted = true;
    store.prediction.outcome = "correct";
    store.settlement.guessReward = 75;
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.text()).toContain("猜對 ✓");
    expect(wrapper.text()).toContain("+75 捷點");
  });

  it("shows guess wrong row", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = settlementStore();
    store.prediction.submitted = true;
    store.prediction.outcome = "wrong";
    store.settlement.guessReward = 0;
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.text()).toContain("猜錯 ✗");
  });

  it("shows ComboBonus when combo is true", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = settlementStore();
    store.settlement.combo = true;
    store.settlement.pledgeReward = 150;
    store.settlement.guessReward = 75;
    store.settlement.totalReward = 250;
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.find(".combo-bonus-stub").exists()).toBe(true);
  });

  it("does not show ComboBonus when combo is false", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    settlementStore();
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.find(".combo-bonus-stub").exists()).toBe(false);
  });

  it("dismisses overlay on confirm button click", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    settlementStore();
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.find(".overlay-backdrop").exists()).toBe(true);
    await wrapper.find(".dismiss-btn").trigger("click");
    expect(wrapper.find(".overlay-backdrop").exists()).toBe(false);
  });

  // fe.2 — multiplier line item
  it("shows 加成倍數 line with Silver tier 1.2x multiplier", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = settlementStore();
    store.settlement.multiplier = 1.2;
    store.settlement.adjustedReward = 180;
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.text()).toContain("加成倍數：1.2x");
    expect(wrapper.text()).toContain("實際獲得：180 點");
  });

  it("shows 加成倍數 line with Bronze tier 1.0x multiplier (always shown)", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = settlementStore();
    store.settlement.multiplier = 1.0;
    store.settlement.adjustedReward = 150;
    const wrapper = mount(SettlementOverlay, {
      global: { plugins: [pinia, makeRouter()], stubs: { ComboBonus: COMBO_STUB } },
    });
    expect(wrapper.text()).toContain("加成倍數：1.0x");
    expect(wrapper.text()).toContain("實際獲得：150 點");
  });
});
