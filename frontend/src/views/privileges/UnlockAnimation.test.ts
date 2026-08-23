import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useLoyaltyTierStore } from "../../stores/loyaltyTier";
import UnlockAnimation from "./UnlockAnimation.vue";

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [{ path: "/privileges", component: { template: "<div />" } }],
  });
}

describe("UnlockAnimation", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("does not render .unlock-animation when unlockPending is false", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useLoyaltyTierStore();
    store.unlockPending = false;
    const wrapper = mount(UnlockAnimation, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".unlock-animation").exists()).toBe(false);
  });

  it("renders .unlock-animation when unlockPending is true", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useLoyaltyTierStore();
    store.unlockPending = true;
    const wrapper = mount(UnlockAnimation, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".unlock-animation").exists()).toBe(true);
  });

  it("shows tier name and 解鎖 text when unlockPending is true", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useLoyaltyTierStore();
    store.unlockPending = true;
    store.cumulativePoints = 450; // Silver
    const wrapper = mount(UnlockAnimation, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.text()).toContain("解鎖");
    expect(wrapper.text()).toContain("白銀");
  });
});
