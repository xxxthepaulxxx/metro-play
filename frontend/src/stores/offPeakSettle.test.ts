/**
 * Acceptance test for issue #28 — Cross-store multiplier integration in offPeak.settle()
 *
 * Scenario: User completes a session; settlement applies loyalty tier multiplier.
 * Silver tier → multiplier 1.2 → adjustedReward = Math.round(totalReward * 1.2)
 * Wallet is credited adjustedReward (not raw totalReward).
 * loyaltyTierStore.cumulativePoints grows by adjustedReward.
 * Settlement state exposes multiplier and adjustedReward for UI display.
 */

import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API modules before importing the store
vi.mock("../api/mockApi", () => ({
  verifyGateTap: vi.fn().mockResolvedValue({
    verified: true,
    onTime: true,
    entryTime: "10:30",
    offPeakWindow: { start: "10:00", end: "16:00" },
    outcome: "success",
  }),
  settleGame: vi.fn().mockResolvedValue({
    settlementId: "mock-settlement-id",
    gameA: { outcome: "success", reward: 100 },
    gameB: { outcome: "correct", reward: 50, actualRidership: 520 },
    combo: false,
    totalReward: 100,
    newBalance: 600,
    carbonFundDelta: 0,
    badge: null,
  }),
}));

vi.mock("../api/mockData", () => ({
  getOffPeakWindow: vi.fn().mockReturnValue({
    start: "10:00",
    end: "16:00",
    label: "Morning Off-Peak",
    confidence: 0.9,
  }),
  getRidershipData: vi.fn().mockReturnValue({
    date: "2026-08-12",
    line: "wenhu",
    hourly: new Array(24).fill(500),
    peakHour: 8,
    offPeakThreshold: 560,
  }),
}));

import { useLoyaltyTierStore } from "./loyaltyTier";
import { useOffPeakStore } from "./offPeak";
import { useWalletStore } from "./wallet";

describe("offPeak.settle() — tier multiplier integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("applies Silver tier 1.2x multiplier to adjustedReward (totalReward=100 → 120)", async () => {
    // Arrange: loyaltyTierStore is Silver (default initialises at 450 pts → Silver, multiplier 1.2)
    const loyaltyTierStore = useLoyaltyTierStore();
    expect(loyaltyTierStore.multiplier).toBe(1.2);

    const store = useOffPeakStore();
    store.commitPledge(50);

    // Act
    await store.settle();

    // Assert: settlement state carries multiplier and adjustedReward
    expect(store.settlement.multiplier).toBe(1.2);
    expect(store.settlement.adjustedReward).toBe(120); // Math.round(100 * 1.2)
  });

  it("credits wallet with adjustedReward (not raw totalReward)", async () => {
    const wallet = useWalletStore();
    const initialBalance = wallet.balance; // 500

    const store = useOffPeakStore();
    store.commitPledge(50); // balance → 450

    await store.settle();

    // adjustedReward = Math.round(100 * 1.2) = 120
    expect(wallet.balance).toBe(initialBalance - 50 + 120); // 570
  });

  it("adds adjustedReward to loyaltyTierStore.cumulativePoints", async () => {
    const loyaltyTierStore = useLoyaltyTierStore();
    const pointsBefore = loyaltyTierStore.cumulativePoints; // 450

    const store = useOffPeakStore();
    store.commitPledge(50);

    await store.settle();

    expect(loyaltyTierStore.cumulativePoints).toBe(pointsBefore + 120); // 570
  });

  it("shows 加成倍數 multiplier line (Bronze tier 1.0x still stored)", async () => {
    // Seed Bronze tier: 0 cumulative points
    const loyaltyTierStore = useLoyaltyTierStore();
    loyaltyTierStore.cumulativePoints = 0;
    expect(loyaltyTierStore.multiplier).toBe(1.0);

    const store = useOffPeakStore();
    store.commitPledge(50);
    await store.settle();

    expect(store.settlement.multiplier).toBe(1.0);
    expect(store.settlement.adjustedReward).toBe(100); // Math.round(100 * 1.0)
  });
});
