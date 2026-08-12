import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ProgressRing from "./ProgressRing.vue";

describe("ProgressRing", () => {
  it("mounts without crashing with value=50, total=100", () => {
    const wrapper = mount(ProgressRing, { props: { value: 50, total: 100 } });
    expect(wrapper.find("svg").exists()).toBe(true);
    expect(wrapper.text()).toContain("50%");
  });
});
