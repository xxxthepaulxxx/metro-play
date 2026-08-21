import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/mockApi", () => ({
  purchaseBox: vi.fn().mockResolvedValue({
    boxId: "box-abc",
    destination: {
      id: "dest-001",
      name: "北投溫泉",
      station: "新北投",
      description: "享受台北最著名的天然溫泉鄉",
      merchantCode: "MERCH-BEITOU-001",
      discountText: "溫泉湯屋85折",
      bonusPoints: 100,
    },
  }),
  rerollBox: vi.fn().mockResolvedValue({
    destination: {
      id: "dest-002",
      name: "永康街",
      station: "東門",
      description: "品嘗最道地的台灣傳統美食街",
      merchantCode: "MERCH-YONGKANG-001",
      discountText: "鼎泰豐套餐9折",
      bonusPoints: 80,
    },
  }),
  scanStation: vi.fn().mockResolvedValue({ verified: true }),
  scanMerchant: vi.fn().mockResolvedValue({
    verified: true,
    discountText: "溫泉湯屋85折",
    bonusPoints: 100,
  }),
}));

import { useBlindBoxStore } from "./blindBox";
import { useWalletStore } from "./wallet";

describe("useBlindBoxStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("purchaseBox", () => {
    it("deducts 30 points and sets activeBox", async () => {
      const store = useBlindBoxStore();
      const wallet = useWalletStore();
      await store.purchaseBox();
      expect(wallet.balance).toBe(470); // 500 - 30
      expect(store.activeBox.id).toBe("box-abc");
      expect(store.activeBox.destination?.name).toBe("北投溫泉");
    });

    it("is a no-op when wallet balance < 30", async () => {
      const store = useBlindBoxStore();
      const wallet = useWalletStore();
      wallet.deduct(480); // leave only 20 pts
      await store.purchaseBox();
      expect(store.activeBox.id).toBeNull();
    });

    it("resets rerollCount on new purchase", async () => {
      const store = useBlindBoxStore();
      store.rerollCount = 1;
      await store.purchaseBox();
      expect(store.rerollCount).toBe(0);
    });
  });

  describe("rerollBox", () => {
    it("deducts 10 points and updates destination", async () => {
      const store = useBlindBoxStore();
      const wallet = useWalletStore();
      await store.purchaseBox(); // sets activeBox, balance → 470
      await store.rerollBox();
      expect(wallet.balance).toBe(460); // 470 - 10
      expect(store.activeBox.destination?.name).toBe("永康街");
      expect(store.rerollCount).toBe(1);
    });

    it("is a no-op when rerollCount is already 1", async () => {
      const store = useBlindBoxStore();
      const wallet = useWalletStore();
      await store.purchaseBox();
      store.rerollCount = 1;
      const balanceBefore = wallet.balance;
      await store.rerollBox();
      expect(wallet.balance).toBe(balanceBefore); // no deduction
    });

    it("is a no-op when no active box", async () => {
      const store = useBlindBoxStore();
      const wallet = useWalletStore();
      const balanceBefore = wallet.balance;
      await store.rerollBox();
      expect(wallet.balance).toBe(balanceBefore);
    });
  });

  describe("verifyStation", () => {
    it("sets stationVerified to true", async () => {
      const store = useBlindBoxStore();
      await store.purchaseBox();
      await store.verifyStation("新北投");
      expect(store.activeBox.stationVerified).toBe(true);
    });

    it("is a no-op when already verified", async () => {
      const store = useBlindBoxStore();
      await store.purchaseBox();
      store.activeBox.stationVerified = true;
      await store.verifyStation("新北投");
      // scanStation should not have been called a second time — verified stays true
      expect(store.activeBox.stationVerified).toBe(true);
    });
  });

  describe("verifyMerchant", () => {
    it("sets merchantVerified and reward after station is verified", async () => {
      const store = useBlindBoxStore();
      await store.purchaseBox();
      store.activeBox.stationVerified = true;
      await store.verifyMerchant("MERCH-BEITOU-001");
      expect(store.activeBox.merchantVerified).toBe(true);
      expect(store.reward.bonusPoints).toBe(100);
      expect(store.reward.discountActivated).toBe(true);
    });

    it("is a no-op when station not verified first", async () => {
      const store = useBlindBoxStore();
      await store.purchaseBox();
      await store.verifyMerchant("MERCH-BEITOU-001");
      expect(store.activeBox.merchantVerified).toBe(false);
    });
  });

  describe("claimReward", () => {
    it("credits wallet and sets reward.done", async () => {
      const store = useBlindBoxStore();
      const wallet = useWalletStore();
      await store.purchaseBox(); // balance = 470
      store.activeBox.stationVerified = true;
      store.activeBox.merchantVerified = true;
      store.reward.bonusPoints = 100;
      store.claimReward();
      expect(wallet.balance).toBe(570); // 470 + 100
      expect(store.reward.done).toBe(true);
    });

    it("is idempotent — second call is a no-op", async () => {
      const store = useBlindBoxStore();
      const wallet = useWalletStore();
      await store.purchaseBox();
      store.activeBox.merchantVerified = true;
      store.reward.bonusPoints = 100;
      store.claimReward();
      const balanceAfterFirst = wallet.balance;
      store.claimReward();
      expect(wallet.balance).toBe(balanceAfterFirst);
    });
  });

  describe("resetBox", () => {
    it("clears all state", async () => {
      const store = useBlindBoxStore();
      await store.purchaseBox();
      store.resetBox();
      expect(store.activeBox.id).toBeNull();
      expect(store.activeBox.destination).toBeNull();
      expect(store.rerollCount).toBe(0);
      expect(store.reward.done).toBe(false);
    });
  });
});
