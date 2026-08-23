import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useLoyaltyTierStore } from "../../stores/loyaltyTier";
import CurrentPerksCard from "./CurrentPerksCard.vue";
import NextTierCard from "./NextTierCard.vue";

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [{ path: "/privileges", component: { template: "<div />" } }],
  });
}

function seedStore(cumulativePoints: number) {
  const store = useLoyaltyTierStore();
  store.cumulativePoints = cumulativePoints;
  return store;
}

describe("CurrentPerksCard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows 當前特權 title", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450); // Silver
    const wrapper = mount(CurrentPerksCard, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("當前特權");
  });

  it("shows Silver tier 1.2x multiplier", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450); // Silver, multiplier 1.2
    const wrapper = mount(CurrentPerksCard, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("1.2x");
  });

  it("shows Platinum tier 2.0x multiplier", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(1000); // Platinum, multiplier 2.0
    const wrapper = mount(CurrentPerksCard, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("2.0x");
  });
});

describe("NextTierCard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows 下一等級特權 title", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450); // Silver → next is Gold
    const wrapper = mount(NextTierCard, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("下一等級特權");
  });

  it("shows next tier multiplier for Silver (next: Gold 1.5x)", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450); // Silver → next is Gold at 1.5x
    const wrapper = mount(NextTierCard, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("1.5x");
  });

  it("shows 已達最高等級 at Platinum", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(1000); // Platinum — no next tier
    const wrapper = mount(NextTierCard, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("已達最高等級");
  });
});
