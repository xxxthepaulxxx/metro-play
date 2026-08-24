import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { DISTRICTS } from "../api/mockData";
import DistrictDetailCard from "./DistrictDetailCard.vue";

const xinyi = DISTRICTS.find((d) => d.id === "xinyi") as (typeof DISTRICTS)[0];

describe("DistrictDetailCard", () => {
  it("shows district name", () => {
    const wrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds: new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]),
        threshold: xinyi.threshold,
        bonusPoints: xinyi.bonusPoints,
        isUnlocked: false,
      },
    });
    expect(wrapper.text()).toContain("信義探險區");
  });

  it("shows all stations in the list", () => {
    const wrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds: new Set<string>(),
        threshold: xinyi.threshold,
        bonusPoints: xinyi.bonusPoints,
        isUnlocked: false,
      },
    });
    const rows = wrapper.findAll(".station-row");
    expect(rows).toHaveLength(xinyi.stations.length); // 6
  });

  it("marks visited stations with amber checkmark class and ✓", () => {
    const visitedIds = new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]);
    const wrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds,
        threshold: xinyi.threshold,
        bonusPoints: xinyi.bonusPoints,
        isUnlocked: false,
      },
    });
    const visited = wrapper.findAll(".station-row.visited");
    const unvisited = wrapper.findAll(".station-row.unvisited");
    expect(visited).toHaveLength(3);
    expect(unvisited).toHaveLength(3);
    expect(visited[0]?.text()).toContain("✓");
    expect(unvisited[0]?.text()).toContain("○");
  });

  it("shows progress label as visited / threshold", () => {
    const wrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds: new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]),
        threshold: xinyi.threshold, // 4
        bonusPoints: xinyi.bonusPoints,
        isUnlocked: false,
      },
    });
    expect(wrapper.text()).toContain("3 / 4");
  });

  it("shows bonus points preview", () => {
    const wrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds: new Set<string>(),
        threshold: xinyi.threshold,
        bonusPoints: xinyi.bonusPoints, // 50
        isUnlocked: false,
      },
    });
    expect(wrapper.text()).toContain("+50 pts");
  });

  it("progress bar aria-valuenow reflects visited/threshold pct", () => {
    const wrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds: new Set(["xinyi-city-hall", "xinyi-taipei-101", "xinyi-xiangshan"]),
        threshold: 4,
        bonusPoints: xinyi.bonusPoints,
        isUnlocked: false,
      },
    });
    const bar = wrapper.find("[role='progressbar']");
    expect(bar.attributes("aria-valuenow")).toBe("75"); // 3/4 = 75%
  });

  it("shows 已解鎖 badge only when isUnlocked is true", () => {
    const lockedWrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds: new Set<string>(),
        threshold: xinyi.threshold,
        bonusPoints: xinyi.bonusPoints,
        isUnlocked: false,
      },
    });
    expect(lockedWrapper.text()).not.toContain("已解鎖");

    const unlockedWrapper = mount(DistrictDetailCard, {
      props: {
        name: xinyi.name,
        stations: xinyi.stations,
        visitedIds: new Set(xinyi.stations.map((s) => s.id)),
        threshold: xinyi.threshold,
        bonusPoints: xinyi.bonusPoints,
        isUnlocked: true,
      },
    });
    expect(unlockedWrapper.text()).toContain("已解鎖");
  });
});
