import { defineStore } from "pinia";
import { computed, ref } from "vue";

const TIER_TABLE = [
  { name: "Bronze", threshold: 0, multiplier: 1.0 },
  { name: "Silver", threshold: 200, multiplier: 1.2 },
  { name: "Gold", threshold: 500, multiplier: 1.5 },
  { name: "Platinum", threshold: 1000, multiplier: 2.0 },
] as const;

type Tier = (typeof TIER_TABLE)[number];

export const useLoyaltyTierStore = defineStore(
  "loyalty-tier-store",
  () => {
    const cumulativePoints = ref(450);
    const unlockPending = ref(false);

    const currentTier = computed((): Tier => {
      let tier: Tier = TIER_TABLE[0];
      for (const entry of TIER_TABLE) {
        if (cumulativePoints.value >= entry.threshold) {
          tier = entry;
        }
      }
      return tier;
    });

    const multiplier = computed((): number => currentTier.value.multiplier);

    const nextTierThreshold = computed((): number | null => {
      const idx = TIER_TABLE.findIndex((t) => t.name === currentTier.value.name);
      const next = TIER_TABLE[idx + 1];
      return next !== undefined ? next.threshold : null;
    });

    const progress = computed((): number => {
      const next = nextTierThreshold.value;
      if (next === null) {
        return 100;
      }
      const curr = currentTier.value.threshold;
      return Math.round(((cumulativePoints.value - curr) / (next - curr)) * 100);
    });

    function addPoints(n: number): void {
      const tierBefore = currentTier.value.name;
      cumulativePoints.value += n;
      if (currentTier.value.name !== tierBefore) {
        unlockPending.value = true;
      }
    }

    function clearUnlock(): void {
      unlockPending.value = false;
    }

    return {
      cumulativePoints,
      unlockPending,
      currentTier,
      multiplier,
      nextTierThreshold,
      progress,
      addPoints,
      clearUnlock,
    };
  },
  { persist: { key: "loyalty-tier-store" } }
);
