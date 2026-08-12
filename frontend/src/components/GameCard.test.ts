import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import GameCard from "./GameCard.vue";

describe("GameCard", () => {
  it("renders slot content", () => {
    const wrapper = mount(GameCard, {
      slots: {
        title: "<span>My Title</span>",
        description: "<p>My Description</p>",
        default: "<button>Click me</button>",
      },
    });
    expect(wrapper.text()).toContain("My Title");
    expect(wrapper.text()).toContain("My Description");
    expect(wrapper.text()).toContain("Click me");
  });
});
