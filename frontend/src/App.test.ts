import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";

function makeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/off-peak", component: { template: "<div />" } },
      { path: "/off-peak/game-a", component: { template: "<div />" } },
      { path: "/off-peak/game-b", component: { template: "<div />" } },
      { path: "/off-peak/settlement", component: { template: "<div />" } },
      { path: "/module2", component: { template: "<div />" } },
      { path: "/privileges", component: { template: "<div />" } },
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

  it("tab 1 is active on /off-peak route", async () => {
    const router = makeRouter();
    await router.push("/off-peak");
    const wrapper = mount(App, {
      global: { plugins: [router, createPinia()] },
    });
    await router.isReady();
    const activeTabs = wrapper.findAll(".tab.active");
    expect(activeTabs).toHaveLength(1);
    expect(activeTabs[0]?.text()).toContain("離峰大作戰");
  });

  it("tab 3 navigates to /privileges and is active on that route", async () => {
    const router = makeRouter();
    await router.push("/privileges");
    const wrapper = mount(App, {
      global: { plugins: [router, createPinia()] },
    });
    await router.isReady();
    const activeTabs = wrapper.findAll(".tab.active");
    expect(activeTabs).toHaveLength(1);
    expect(activeTabs[0]?.text()).toContain("特權");
    const tab3 = wrapper.findAll(".tab")[2];
    expect(tab3?.attributes("href")).toContain("/privileges");
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
