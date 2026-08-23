import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useLoyaltyTierStore } from "../../stores/loyaltyTier";
import PrivilegesHomeView from "./PrivilegesHomeView.vue";

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [{ path: "/privileges", component: { template: "<div />" } }],
  });
}

function seedStore(cumulativePoints: number, unlockPending = false) {
  const store = useLoyaltyTierStore();
  store.cumulativePoints = cumulativePoints;
  store.unlockPending = unlockPending;
  return store;
}

describe("PrivilegesHomeView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // e2e.1 — Silver tier: badge + progress bar, no animation
  it("shows Silver tier badge and progress bar", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450); // Silver, progress 83%
    const wrapper = mount(PrivilegesHomeView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("🥈");
    expect(wrapper.text()).toContain("白銀");
    expect(wrapper.text()).toContain("1.2x 加成");
    const bar = wrapper.find("[role='progressbar']");
    expect(bar.exists()).toBe(true);
    expect(bar.attributes("aria-valuenow")).toBe("83");
  });

  it("shows progress label toward next tier", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450);
    const wrapper = mount(PrivilegesHomeView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("83%");
    expect(wrapper.text()).toContain("下一等級");
  });

  it("does not show UnlockAnimation when unlockPending is false", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450, false);
    const wrapper = mount(PrivilegesHomeView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".unlock-animation").exists()).toBe(false);
  });

  // e2e.2 — Platinum MAX state
  it("shows Platinum tier with MAX state", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(1000); // Platinum
    const wrapper = mount(PrivilegesHomeView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("👑");
    expect(wrapper.text()).toContain("鉑金");
    expect(wrapper.text()).toContain("2.0x 加成");
    const bar = wrapper.find("[role='progressbar']");
    expect(bar.attributes("aria-valuenow")).toBe("100");
    expect(wrapper.text()).toContain("滿級");
  });

  it("shows cumulative points", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedStore(450);
    const wrapper = mount(PrivilegesHomeView, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("450");
  });
});
