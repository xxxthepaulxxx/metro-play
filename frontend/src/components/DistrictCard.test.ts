import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DistrictCard from "./DistrictCard.vue";

const baseProps = {
  name: "信義探險區",
  visited: 3,
  total: 6,
  threshold: 4,
  isUnlocked: false,
  bonusPoints: 50,
};

describe("DistrictCard", () => {
  it("shows district name", () => {
    const wrapper = mount(DistrictCard, { props: baseProps });
    expect(wrapper.text()).toContain("信義探險區");
  });

  it("locked card has dashed border class and lock icon", () => {
    const wrapper = mount(DistrictCard, { props: { ...baseProps, isUnlocked: false } });
    expect(wrapper.find("button").classes()).toContain("locked");
    expect(wrapper.find("button").classes()).not.toContain("unlocked");
    expect(wrapper.text()).toContain("🔒");
    expect(wrapper.text()).not.toContain("已解鎖");
  });

  it("unlocked card has solid border class and 已解鎖 badge", () => {
    const wrapper = mount(DistrictCard, { props: { ...baseProps, isUnlocked: true } });
    expect(wrapper.find("button").classes()).toContain("unlocked");
    expect(wrapper.find("button").classes()).not.toContain("locked");
    expect(wrapper.text()).toContain("✓ 已解鎖");
    expect(wrapper.text()).not.toContain("🔒");
  });

  it("shows visited / threshold progress label", () => {
    const wrapper = mount(DistrictCard, { props: baseProps });
    expect(wrapper.text()).toContain("3 / 4");
  });

  it("shows bonus points preview", () => {
    const wrapper = mount(DistrictCard, { props: baseProps });
    expect(wrapper.text()).toContain("+50 pts");
  });

  it("emits click when tapped", async () => {
    const wrapper = mount(DistrictCard, { props: baseProps });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});
