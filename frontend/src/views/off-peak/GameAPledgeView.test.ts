import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useOffPeakStore } from "../../stores/offPeak";
import GameAPledgeView from "./GameAPledgeView.vue";

vi.mock("../../api/mockApi", () => ({
  submitPledge: vi.fn().mockResolvedValue({
    pledgeId: "test-pledge-id",
    offPeakWindow: { start: "10:00", end: "16:00", label: "Morning Off-Peak" },
    balance: 950,
    deadline: "2026-08-12T10:00:00.000Z",
  }),
}));

const CONFIRM_STUB = {
  template: '<div class="pledge-confirm-stub" />',
  props: ["offPeakWindow", "staked", "expectedReturn"],
};

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/off-peak", component: { template: "<div />" } },
      { path: "/off-peak/game-a", component: { template: "<div />" } },
    ],
  });
}

describe("GameAPledgeView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("displays the off-peak window", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    expect(wrapper.text()).toContain("今日離峰時段");
  });

  it("shows current balance in the hint", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    expect(wrapper.text()).toContain("500");
  });

  it("submit button is disabled when stake is below minimum", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    const input = wrapper.find("#stake-input");
    await input.setValue(5);
    expect(wrapper.find(".submit-btn").attributes("disabled")).toBeDefined();
  });

  it("submit button is disabled when stake exceeds balance", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    const input = wrapper.find("#stake-input");
    await input.setValue(9999);
    expect(wrapper.find(".submit-btn").attributes("disabled")).toBeDefined();
  });

  it("submit button is enabled for a valid stake", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    const input = wrapper.find("#stake-input");
    await input.setValue(50);
    expect(wrapper.find(".submit-btn").attributes("disabled")).toBeUndefined();
  });

  it("shows confirmation screen after successful submit", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    const input = wrapper.find("#stake-input");
    await input.setValue(50);
    await wrapper.find(".pledge-form").trigger("submit");
    await flushPromises();
    expect(wrapper.find(".pledge-confirm-stub").exists()).toBe(true);
  });

  it("shows 已承諾 state when pledge is already committed", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    store.pledge.committed = true;
    store.pledge.staked = 80;
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    expect(wrapper.text()).toContain("已承諾");
    expect(wrapper.text()).toContain("80");
  });

  it("shows error message when submitPledge throws", async () => {
    const { submitPledge } = await import("../../api/mockApi");
    vi.mocked(submitPledge).mockRejectedValueOnce(new Error("network error"));

    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameAPledgeView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameAPledgeConfirm: CONFIRM_STUB } },
    });
    const input = wrapper.find("#stake-input");
    await input.setValue(50);
    await wrapper.find(".pledge-form").trigger("submit");
    await flushPromises();
    expect(wrapper.find(".error-msg").exists()).toBe(true);
    expect(wrapper.text()).toContain("提交失敗");
  });
});
