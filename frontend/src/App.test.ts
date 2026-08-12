import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/game-a", component: { template: "<div />" } },
      { path: "/game-b", component: { template: "<div />" } },
      { path: "/settlement", component: { template: "<div />" } },
      { path: "/module2", component: { template: "<div />" } },
      { path: "/module3", component: { template: "<div />" } },
      { path: "/module4", component: { template: "<div />" } },
    ],
  });
}

describe("App", () => {
  it("renders without crashing", async () => {
    const router = makeRouter();
    const wrapper = mount(App, {
      global: { plugins: [router, createPinia()] },
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });

  it("renders 4 tabs", async () => {
    const router = makeRouter();
    const wrapper = mount(App, {
      global: { plugins: [router, createPinia()] },
    });
    await router.isReady();
    expect(wrapper.findAll(".tab")).toHaveLength(4);
  });

  it("tab 1 is active on root route", async () => {
    const router = makeRouter();
    await router.push("/");
    const wrapper = mount(App, {
      global: { plugins: [router, createPinia()] },
    });
    await router.isReady();
    const activeTabs = wrapper.findAll(".tab.active");
    expect(activeTabs).toHaveLength(1);
    expect(activeTabs[0]?.text()).toContain("離峰大作戰");
  });

  it("particles have pointer-events none", async () => {
    const router = makeRouter();
    const wrapper = mount(App, {
      global: { plugins: [router, createPinia()] },
    });
    await router.isReady();
    expect(wrapper.find(".particles").exists()).toBe(true);
  });
});
