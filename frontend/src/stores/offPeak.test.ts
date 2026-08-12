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
    gameA: { outcome: "success", reward: 150 },
    gameB: { outcome: "correct", reward: 75, actualRidership: 520 },
    combo: true,
    totalReward: 250,
    newBalance: 1250,
    carbonFundDelta: 50,
    badge: "Off-Peak Master",
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

import { useOffPeakStore } from "./offPeak";

describe("useOffPeakStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("commitPledge", () => {
    it("deducts balance when stake is valid", () => {
      const store = useOffPeakStore();
      store.commitPledge(50);
      expect(store.balance).toBe(950);
      expect(store.pledge.staked).toBe(50);
      expect(store.pledge.committed).toBe(true);
    });

    it("is a no-op when stake is less than 10", () => {
      const store = useOffPeakStore();
      const initialBalance = store.balance;
      store.commitPledge(5);
      expect(store.balance).toBe(initialBalance);
      expect(store.pledge.committed).toBe(false);
    });

    it("is a no-op when stake equals 9 (below minimum)", () => {
      const store = useOffPeakStore();
      const initialBalance = store.balance;
      store.commitPledge(9);
      expect(store.balance).toBe(initialBalance);
      expect(store.pledge.committed).toBe(false);
    });

    it("is a no-op when stake exceeds balance", () => {
      const store = useOffPeakStore();
      const initialBalance = store.balance;
      store.commitPledge(initialBalance + 1);
      expect(store.balance).toBe(initialBalance);
      expect(store.pledge.committed).toBe(false);
    });

    it("accepts stake exactly equal to balance", () => {
      const store = useOffPeakStore();
      const initialBalance = store.balance;
      store.commitPledge(initialBalance);
      expect(store.balance).toBe(0);
      expect(store.pledge.committed).toBe(true);
    });
  });

  describe("settle", () => {
    it("double settle() call is a no-op (idempotent)", async () => {
      const store = useOffPeakStore();
      store.commitPledge(50);
      await store.settle();
      const balanceAfterFirst = store.balance;
      const rewardAfterFirst = store.settlement.totalReward;

      await store.settle(); // second call should be no-op
      expect(store.balance).toBe(balanceAfterFirst);
      expect(store.settlement.totalReward).toBe(rewardAfterFirst);
      expect(store.settlement.done).toBe(true);
    });
  });

  describe("activityLog", () => {
    it("does not exceed 100 entries", () => {
      const store = useOffPeakStore();
      // Call commitPledge many times with invalid stakes to log entries without changing state
      for (let i = 0; i < 150; i++) {
        store.appendLog("testAction", { i }, { success: true });
      }
      expect(store.activityLog.length).toBeLessThanOrEqual(100);
    });

    it("evicts oldest entries when over 100", () => {
      const store = useOffPeakStore();
      for (let i = 0; i < 110; i++) {
        store.appendLog("testAction", { index: i }, { success: true });
      }
      expect(store.activityLog.length).toBe(100);
      // The oldest entries should have been evicted; the remaining should start from index 10
      const firstEntry = store.activityLog[0];
      expect(firstEntry).toBeDefined();
      if (firstEntry !== undefined) {
        expect(firstEntry.payload.index).toBe(10);
      }
    });

    it("records commitPledge actions in the log", () => {
      const store = useOffPeakStore();
      store.commitPledge(50);
      const entry = store.activityLog.find((e) => e.action === "commitPledge");
      expect(entry).toBeDefined();
    });
  });
});
