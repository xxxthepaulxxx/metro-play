import { defineStore } from "pinia";
import { settleGame, verifyGateTap } from "../api/mockApi";
import { getOffPeakWindow } from "../api/mockData";
import { useLoyaltyTierStore } from "./loyaltyTier";
import { useWalletStore } from "./wallet";

interface ActivityLogEntry {
  ts: string;
  action: string;
  payload: Record<string, unknown>;
  result: Record<string, unknown>;
}

interface OffPeakState {
  carbonFundPool: number;
  pledge: {
    staked: number;
    committed: boolean;
    enteredAt: string | null;
    outcome: "success" | "forfeit" | "pending" | null;
  };
  prediction: {
    range: { min: number; max: number };
    submitted: boolean;
    outcome: "correct" | "wrong" | "pending" | null;
  };
  settlement: {
    done: boolean;
    combo: boolean;
    totalReward: number;
    pledgeReward: number;
    guessReward: number;
    badge: string | null;
    multiplier: number;
    adjustedReward: number;
  };
  offPeakWindow: {
    start: string;
    end: string;
  };
  activityLog: ActivityLogEntry[];
  // Internal IDs tracked across actions
  _pledgeId: string | null;
  _predictionId: string | null;
}

const initialWindow = getOffPeakWindow("wenhu");

export const useOffPeakStore = defineStore("off-peak-store", {
  state: (): OffPeakState => ({
    carbonFundPool: 0,
    pledge: {
      staked: 0,
      committed: false,
      enteredAt: null,
      outcome: null,
    },
    prediction: {
      range: { min: 0, max: 0 },
      submitted: false,
      outcome: null,
    },
    settlement: {
      done: false,
      combo: false,
      totalReward: 0,
      pledgeReward: 0,
      guessReward: 0,
      badge: null,
      multiplier: 1,
      adjustedReward: 0,
    },
    offPeakWindow: {
      start: initialWindow.start,
      end: initialWindow.end,
    },
    activityLog: [],
    _pledgeId: null,
    _predictionId: null,
  }),

  actions: {
    appendLog(
      action: string,
      payload: Record<string, unknown>,
      result: Record<string, unknown>
    ): void {
      this.activityLog.push({
        ts: new Date().toISOString(),
        action,
        payload,
        result,
      });
      if (this.activityLog.length > 100) {
        this.activityLog.splice(0, this.activityLog.length - 100);
      }
    },

    commitPledge(stake: number): void {
      const wallet = useWalletStore();
      if (stake < 10 || stake > wallet.balance) {
        this.appendLog("commitPledge", { stake }, { success: false, reason: "invalid_stake" });
        return;
      }
      wallet.deduct(stake);
      this.pledge.staked = stake;
      this.pledge.committed = true;
      this.appendLog(
        "commitPledge",
        { stake },
        { success: true, newBalance: wallet.balance, staked: stake }
      );
    },

    submitPrediction(range: { min: number; max: number }): void {
      if (range.max <= range.min) {
        this.appendLog(
          "submitPrediction",
          { rangeMin: range.min, rangeMax: range.max },
          { success: false, reason: "invalid_range" }
        );
        return;
      }
      this.prediction.range = { min: range.min, max: range.max };
      this.prediction.submitted = true;
      this.appendLog(
        "submitPrediction",
        { rangeMin: range.min, rangeMax: range.max },
        { success: true }
      );
    },

    async verifyEntry(entryTimestamp: string): Promise<void> {
      const pledgeId = this._pledgeId ?? "mock-pledge-id";
      const response = await verifyGateTap(pledgeId, entryTimestamp);
      this.pledge.enteredAt = entryTimestamp;
      this.pledge.outcome = response.outcome;
      this.appendLog(
        "verifyEntry",
        { entryTimestamp },
        {
          verified: response.verified,
          onTime: response.onTime,
          outcome: response.outcome,
        }
      );
    },

    async settle(): Promise<void> {
      if (this.settlement.done) {
        return;
      }
      const wallet = useWalletStore();
      const loyaltyTierStore = useLoyaltyTierStore();
      const pledgeId = this._pledgeId ?? "mock-pledge-id";
      const predictionId = this.prediction.submitted
        ? (this._predictionId ?? "mock-prediction-id")
        : undefined;
      const response = await settleGame(pledgeId, predictionId);
      const adjustedReward = Math.round(response.totalReward * loyaltyTierStore.multiplier);
      this.settlement.done = true;
      this.settlement.combo = response.combo;
      this.settlement.totalReward = response.totalReward;
      this.settlement.pledgeReward = response.gameA.reward;
      this.settlement.guessReward = response.gameB.reward;
      this.settlement.badge = response.badge;
      this.settlement.multiplier = loyaltyTierStore.multiplier;
      this.settlement.adjustedReward = adjustedReward;
      wallet.credit(adjustedReward);
      loyaltyTierStore.addPoints(adjustedReward);
      if (this.prediction.submitted && response.gameB.outcome !== "skipped") {
        this.prediction.outcome = response.gameB.outcome;
      }

      if (this.pledge.outcome === "forfeit") {
        this.carbonFundPool += this.pledge.staked;
      }

      this.appendLog(
        "settle",
        { pledgeId, predictionId: predictionId ?? null },
        {
          success: true,
          totalReward: response.totalReward,
          adjustedReward,
          multiplier: loyaltyTierStore.multiplier,
          combo: response.combo,
          badge: response.badge,
          newBalance: wallet.balance,
        }
      );
    },

    resetDay(): void {
      this.pledge = {
        staked: 0,
        committed: false,
        enteredAt: null,
        outcome: null,
      };
      this.prediction = {
        range: { min: 0, max: 0 },
        submitted: false,
        outcome: null,
      };
      this.settlement = {
        done: false,
        combo: false,
        totalReward: 0,
        pledgeReward: 0,
        guessReward: 0,
        badge: null,
        multiplier: 1,
        adjustedReward: 0,
      };
      this._pledgeId = null;
      this._predictionId = null;
      this.appendLog("resetDay", {}, { success: true });
    },

    async simulateGateTap(): Promise<void> {
      const now = new Date().toISOString();
      await this.verifyEntry(now);
    },
  },

  persist: { key: "off-peak-store" },
});
