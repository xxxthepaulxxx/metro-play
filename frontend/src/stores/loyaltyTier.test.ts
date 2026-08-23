import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useLoyaltyTierStore } from "./loyaltyTier";

describe("useLoyaltyTierStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Initial state
  it("initialises cumulativePoints at 450", () => {
    const store = useLoyaltyTierStore();
    expect(store.cumulativePoints).toBe(450);
  });

  it("initialises unlockPending at false", () => {
    const store = useLoyaltyTierStore();
    expect(store.unlockPending).toBe(false);
  });

  // currentTier derived from 450 points — highest threshold <= 450 is Silver (200)
  it("currentTier is Silver when cumulativePoints is 450", () => {
    const store = useLoyaltyTierStore();
    expect(store.currentTier.name).toBe("Silver");
  });

  it("multiplier is 1.2 for Silver tier", () => {
    const store = useLoyaltyTierStore();
    expect(store.multiplier).toBe(1.2);
  });

  // nextTierThreshold for Silver is Gold at 500
  it("nextTierThreshold is 500 when currentTier is Silver", () => {
    const store = useLoyaltyTierStore();
    expect(store.nextTierThreshold).toBe(500);
  });

  // progress = Math.round((450 - 200) / (500 - 200) * 100) = Math.round(250/300*100) = Math.round(83.33) = 83
  it("progress is 83 with 450 points in Silver tier", () => {
    const store = useLoyaltyTierStore();
    expect(store.progress).toBe(83);
  });

  // addPoints — no tier upgrade: 450 + 10 = 460, still Silver
  it("addPoints does NOT set unlockPending when threshold not crossed", () => {
    const store = useLoyaltyTierStore();
    store.addPoints(10);
    expect(store.cumulativePoints).toBe(460);
    expect(store.unlockPending).toBe(false);
  });

  // addPoints — tier upgrade: 450 + 60 = 510, crosses Gold threshold (500)
  it("addPoints sets unlockPending=true when tier is upgraded", () => {
    const store = useLoyaltyTierStore();
    store.addPoints(60);
    expect(store.cumulativePoints).toBe(510);
    expect(store.currentTier.name).toBe("Gold");
    expect(store.unlockPending).toBe(true);
  });

  // clearUnlock
  it("clearUnlock sets unlockPending=false", () => {
    const store = useLoyaltyTierStore();
    store.addPoints(60); // triggers tier upgrade → unlockPending=true
    store.clearUnlock();
    expect(store.unlockPending).toBe(false);
  });

  // Platinum edge case: progress=100, nextTierThreshold=null
  it("progress is 100 when at Platinum tier", () => {
    const store = useLoyaltyTierStore();
    store.addPoints(550); // 450 + 550 = 1000 → Platinum
    expect(store.currentTier.name).toBe("Platinum");
    expect(store.nextTierThreshold).toBeNull();
    expect(store.progress).toBe(100);
  });

  // Persist key check
  it("store id (persist key) is loyalty-tier-store", () => {
    const store = useLoyaltyTierStore();
    expect(store.$id).toBe("loyalty-tier-store");
  });
});
