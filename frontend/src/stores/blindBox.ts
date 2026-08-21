import { defineStore } from "pinia";
import {
  purchaseBox as purchaseBoxApi,
  rerollBox as rerollBoxApi,
  scanMerchant as scanMerchantApi,
  scanStation as scanStationApi,
} from "../api/mockApi";
import type { Destination } from "../api/mockData";
import { useWalletStore } from "./wallet";

const BOX_COST = 30;
const REROLL_COST = 10;

interface BlindBoxState {
  activeBox: {
    id: string | null;
    destination: Destination | null;
    stationVerified: boolean;
    merchantVerified: boolean;
  };
  reward: {
    done: boolean;
    discountActivated: boolean;
    bonusPoints: number;
  };
  rerollCount: number;
}

export const useBlindBoxStore = defineStore("blind-box-store", {
  state: (): BlindBoxState => ({
    activeBox: {
      id: null,
      destination: null,
      stationVerified: false,
      merchantVerified: false,
    },
    reward: {
      done: false,
      discountActivated: false,
      bonusPoints: 0,
    },
    rerollCount: 0,
  }),

  actions: {
    async purchaseBox(): Promise<void> {
      const wallet = useWalletStore();
      if (wallet.balance < BOX_COST) return;
      wallet.deduct(BOX_COST);
      const response = await purchaseBoxApi(BOX_COST);
      this.activeBox.id = response.boxId;
      this.activeBox.destination = response.destination;
      this.activeBox.stationVerified = false;
      this.activeBox.merchantVerified = false;
      this.rerollCount = 0;
      this.reward = { done: false, discountActivated: false, bonusPoints: 0 };
    },

    async rerollBox(): Promise<void> {
      if (this.rerollCount >= 1 || !this.activeBox.id) return;
      const wallet = useWalletStore();
      if (wallet.balance < REROLL_COST) return;
      wallet.deduct(REROLL_COST);
      const response = await rerollBoxApi(this.activeBox.id, REROLL_COST);
      this.activeBox.destination = response.destination;
      this.rerollCount += 1;
    },

    async verifyStation(stationId: string): Promise<void> {
      if (!this.activeBox.id || this.activeBox.stationVerified) return;
      const response = await scanStationApi(this.activeBox.id, stationId);
      this.activeBox.stationVerified = response.verified;
    },

    async verifyMerchant(merchantCode: string): Promise<void> {
      if (!this.activeBox.id || !this.activeBox.stationVerified || this.activeBox.merchantVerified)
        return;
      const response = await scanMerchantApi(this.activeBox.id, merchantCode);
      this.activeBox.merchantVerified = response.verified;
      if (response.verified) {
        this.reward.discountActivated = true;
        this.reward.bonusPoints = response.bonusPoints;
      }
    },

    claimReward(): void {
      if (this.reward.done || !this.activeBox.merchantVerified) return;
      const wallet = useWalletStore();
      wallet.credit(this.reward.bonusPoints);
      this.reward.done = true;
    },

    resetBox(): void {
      this.activeBox = {
        id: null,
        destination: null,
        stationVerified: false,
        merchantVerified: false,
      };
      this.reward = { done: false, discountActivated: false, bonusPoints: 0 };
      this.rerollCount = 0;
    },
  },

  persist: { key: "blind-box-store" },
});
