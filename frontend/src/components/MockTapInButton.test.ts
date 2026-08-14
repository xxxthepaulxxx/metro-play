import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useOffPeakStore } from "../stores/offPeak";
import MockTapInButton from "./MockTapInButton.vue";

vi.mock("../api/mockApi", () => ({
  verifyGateTap: vi.fn().mockResolvedValue({
    verified: true,
    onTime: true,
    entryTime: "10:30",
    offPeakWindow: { start: "10:00", end: "16:00" },
    outcome: "success",
  }),
  settleGame: vi.fn().mockResolvedValue({
    settlementId: "test-settlement-id",
    gameA: { outcome: "success", reward: 150 },
    gameB: { outcome: "correct", reward: 75 },
    combo: true,
    totalReward: 250,
    newBalance: 1250,
    carbonFundDelta: 0,
    badge: "Off-Peak Master",
  }),
}));

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [{ path: "/off-peak", component: { template: "<div />" } }],
  });
}

describe("MockTapInButton", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("renders the tap-in button", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(MockTapInButton, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".tap-in-btn").exists()).toBe(true);
    expect(wrapper.find(".tap-in-btn").text()).toContain("模擬進站");
  });

  it("button is enabled by default", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(MockTapInButton, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".tap-in-btn").attributes("disabled")).toBeUndefined();
  });

  it("button is disabled when settlement is already done", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    store.settlement.done = true;
    const wrapper = mount(MockTapInButton, {
      global: { plugins: [pinia, makeRouter()] },
    });
    expect(wrapper.find(".tap-in-btn").attributes("disabled")).toBeDefined();
  });

  it("calls simulateGateTap and settle on click", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    const gateSpyFn = vi.fn().mockResolvedValue(undefined);
    const settleSpyFn = vi.fn().mockResolvedValue(undefined);
    store.simulateGateTap = gateSpyFn;
    store.settle = settleSpyFn;

    const wrapper = mount(MockTapInButton, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".tap-in-btn").trigger("click");
    await flushPromises();
    expect(gateSpyFn).toHaveBeenCalledOnce();
    expect(settleSpyFn).toHaveBeenCalledOnce();
  });

  it("shows error message when store action throws", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    store.simulateGateTap = vi.fn().mockRejectedValue(new Error("network error"));
    store.settle = vi.fn();

    const wrapper = mount(MockTapInButton, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await wrapper.find(".tap-in-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find(".error-msg").exists()).toBe(true);
    expect(wrapper.text()).toContain("進站驗證失敗");
  });
});
