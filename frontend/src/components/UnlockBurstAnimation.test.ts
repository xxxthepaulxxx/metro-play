import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UnlockBurstAnimation from "./UnlockBurstAnimation.vue";

describe("UnlockBurstAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not render when active is false", () => {
    const wrapper = mount(UnlockBurstAnimation, { props: { active: false } });
    expect(wrapper.find(".unlock-burst").exists()).toBe(false);
  });

  it("renders .unlock-burst when active is true", () => {
    const wrapper = mount(UnlockBurstAnimation, { props: { active: true } });
    expect(wrapper.find(".unlock-burst").exists()).toBe(true);
  });

  it("shows 區域解鎖！ text when active", () => {
    const wrapper = mount(UnlockBurstAnimation, { props: { active: true } });
    expect(wrapper.text()).toContain("區域解鎖！");
  });

  it("emits done after 600 ms when active is true", () => {
    const wrapper = mount(UnlockBurstAnimation, { props: { active: true } });
    expect(wrapper.emitted("done")).toBeFalsy();
    vi.advanceTimersByTime(600);
    expect(wrapper.emitted("done")).toBeTruthy();
  });

  it("does not emit done when active is false", () => {
    const wrapper = mount(UnlockBurstAnimation, { props: { active: false } });
    vi.advanceTimersByTime(1000);
    expect(wrapper.emitted("done")).toBeFalsy();
  });

  it("emits done after active transitions from false to true", async () => {
    const wrapper = mount(UnlockBurstAnimation, { props: { active: false } });
    expect(wrapper.emitted("done")).toBeFalsy();
    await wrapper.setProps({ active: true });
    vi.advanceTimersByTime(600);
    expect(wrapper.emitted("done")).toBeTruthy();
  });
});
