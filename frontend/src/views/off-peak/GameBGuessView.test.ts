import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import { useOffPeakStore } from "../../stores/offPeak";
import GameBGuessView from "./GameBGuessView.vue";

vi.mock("../../api/mockApi", () => ({
  submitPrediction: vi.fn().mockResolvedValue({
    predictionId: "test-prediction-id",
    referenceRidership: { yesterday: 800, forecast: 760 },
  }),
}));

const CONFIRM_STUB = {
  template: '<div class="guess-confirm-stub" />',
  props: ["offPeakWindow", "predictionLabel"],
};

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/off-peak", component: { template: "<div />" } },
      { path: "/off-peak/game-b", component: { template: "<div />" } },
    ],
  });
}

describe("GameBGuessView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("displays the off-peak window", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    expect(wrapper.text()).toContain("今日離峰時段");
  });

  it("renders three level buttons", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    expect(wrapper.findAll(".level-btn")).toHaveLength(3);
  });

  it("submit button is disabled when no level selected", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    expect(wrapper.find(".submit-btn").attributes("disabled")).toBeDefined();
  });

  it("activates the clicked level button and enables submit", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    const buttons = wrapper.findAll(".level-btn");
    await buttons[0]?.trigger("click"); // HIGH
    expect(buttons[0]?.classes()).toContain("active");
    expect(buttons[1]?.classes()).not.toContain("active");
    expect(buttons[2]?.classes()).not.toContain("active");
    expect(wrapper.find(".submit-btn").attributes("disabled")).toBeUndefined();
  });

  it("only one level button is active at a time", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    const buttons = wrapper.findAll(".level-btn");
    await buttons[0]?.trigger("click"); // HIGH
    await buttons[2]?.trigger("click"); // LOW
    const active = buttons.filter((b) => b.classes().includes("active"));
    expect(active).toHaveLength(1);
    expect(active[0]?.text()).toContain("低運量");
  });

  it("shows confirmation screen after successful submit", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    await wrapper.findAll(".level-btn")[1]?.trigger("click"); // MED
    await wrapper.find(".submit-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find(".guess-confirm-stub").exists()).toBe(true);
  });

  it("shows locked state when prediction is already submitted", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useOffPeakStore();
    store.prediction.submitted = true;
    store.prediction.range = { min: 400, max: 600 };
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    expect(wrapper.text()).toContain("已提交預測");
    expect(wrapper.find(".submit-btn").exists()).toBe(false);
  });

  it("shows error message when submitPrediction throws", async () => {
    const { submitPrediction } = await import("../../api/mockApi");
    vi.mocked(submitPrediction).mockRejectedValueOnce(new Error("network error"));

    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(GameBGuessView, {
      global: { plugins: [pinia, makeRouter()], stubs: { GameBGuessConfirm: CONFIRM_STUB } },
    });
    await wrapper.findAll(".level-btn")[0]?.trigger("click"); // HIGH
    await wrapper.find(".submit-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find(".error-msg").exists()).toBe(true);
    expect(wrapper.text()).toContain("提交失敗");
  });
});
