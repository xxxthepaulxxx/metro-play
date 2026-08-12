import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PointBadge from "./PointBadge.vue";

describe("PointBadge", () => {
  it('renders "1,234 點" for input 1234', () => {
    const wrapper = mount(PointBadge, { props: { points: 1234 } });
    expect(wrapper.text()).toContain("點");
    expect(wrapper.text()).toMatch(/1[,،٬]?234/);
  });

  it('renders "0 點" for input 0', () => {
    const wrapper = mount(PointBadge, { props: { points: 0 } });
    expect(wrapper.text()).toContain("0");
    expect(wrapper.text()).toContain("點");
  });
});
