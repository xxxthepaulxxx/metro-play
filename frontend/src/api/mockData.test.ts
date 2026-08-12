import { describe, expect, it } from "vitest";
import { getOffPeakWindow, getRidershipData } from "./mockData";

describe("getOffPeakWindow", () => {
  it("returns deterministic results for wenhu (same value on two calls)", () => {
    const first = getOffPeakWindow("wenhu");
    const second = getOffPeakWindow("wenhu");
    expect(first.start).toBe(second.start);
    expect(first.end).toBe(second.end);
    expect(first.label).toBe(second.label);
    expect(first.confidence).toBe(second.confidence);
  });

  it("returns deterministic results for bannan (same value on two calls)", () => {
    const first = getOffPeakWindow("bannan");
    const second = getOffPeakWindow("bannan");
    expect(first.start).toBe(second.start);
    expect(first.end).toBe(second.end);
    expect(first.label).toBe(second.label);
    expect(first.confidence).toBe(second.confidence);
  });

  it("returns a valid HH:MM start time for wenhu", () => {
    const window = getOffPeakWindow("wenhu");
    expect(window.start).toMatch(/^\d{2}:\d{2}$/);
  });

  it("returns a valid HH:MM end time for wenhu", () => {
    const window = getOffPeakWindow("wenhu");
    expect(window.end).toMatch(/^\d{2}:\d{2}$/);
  });

  it("returns confidence between 0 and 1", () => {
    const window = getOffPeakWindow("wenhu");
    expect(window.confidence).toBeGreaterThanOrEqual(0);
    expect(window.confidence).toBeLessThanOrEqual(1);
  });
});

describe("getRidershipData", () => {
  it("returns 24 hourly values for wenhu", () => {
    const data = getRidershipData("wenhu");
    expect(data.hourly).toHaveLength(24);
  });

  it("returns 24 hourly values for bannan", () => {
    const data = getRidershipData("bannan");
    expect(data.hourly).toHaveLength(24);
  });

  it("returns correct line for wenhu", () => {
    const data = getRidershipData("wenhu");
    expect(data.line).toBe("wenhu");
  });

  it("returns correct line for bannan", () => {
    const data = getRidershipData("bannan");
    expect(data.line).toBe("bannan");
  });

  it("offPeakThreshold is 70% of peak hour for wenhu", () => {
    const data = getRidershipData("wenhu");
    const peakValue = data.hourly[data.peakHour];
    expect(peakValue).toBeDefined();
    if (peakValue !== undefined) {
      expect(data.offPeakThreshold).toBe(Math.floor(peakValue * 0.7));
    }
  });

  it("offPeakThreshold is 70% of peak hour for bannan", () => {
    const data = getRidershipData("bannan");
    const peakValue = data.hourly[data.peakHour];
    expect(peakValue).toBeDefined();
    if (peakValue !== undefined) {
      expect(data.offPeakThreshold).toBe(Math.floor(peakValue * 0.7));
    }
  });
});
