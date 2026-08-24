import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { simulateVisit } from "../api/mockApi";
import { DISTRICTS } from "../api/mockData";
import { useWalletStore } from "./wallet";

export const useCityRpgStore = defineStore(
  "city-rpg-store",
  () => {
    const visitedStationIds = ref<Set<string>>(new Set());
    const claimedDistrictBonuses = ref<Set<string>>(new Set());

    function districtProgress(id: string): { visited: number; total: number; threshold: number } {
      const district = DISTRICTS.find((d) => d.id === id);
      if (!district) return { visited: 0, total: 0, threshold: 0 };
      const visited = district.stations.filter((s) => visitedStationIds.value.has(s.id)).length;
      return { visited, total: district.stations.length, threshold: district.threshold };
    }

    function isDistrictUnlocked(id: string): boolean {
      const { visited, threshold } = districtProgress(id);
      return threshold > 0 && visited >= threshold;
    }

    const overallProgress = computed(() => ({
      unlocked: DISTRICTS.filter((d) => isDistrictUnlocked(d.id)).length,
      total: DISTRICTS.length,
    }));

    const totalBonusEarned = computed(() =>
      DISTRICTS.filter((d) => claimedDistrictBonuses.value.has(d.id)).reduce(
        (sum, d) => sum + d.bonusPoints,
        0
      )
    );

    async function addVisit(stationId: string): Promise<void> {
      await simulateVisit(stationId);
      visitedStationIds.value = new Set([...visitedStationIds.value, stationId]);
    }

    function claimBonus(districtId: string): void {
      if (claimedDistrictBonuses.value.has(districtId)) return;
      const district = DISTRICTS.find((d) => d.id === districtId);
      if (!district) return;
      claimedDistrictBonuses.value = new Set([...claimedDistrictBonuses.value, districtId]);
      const walletStore = useWalletStore();
      walletStore.credit(district.bonusPoints);
    }

    return {
      visitedStationIds,
      claimedDistrictBonuses,
      districtProgress,
      isDistrictUnlocked,
      overallProgress,
      totalBonusEarned,
      addVisit,
      claimBonus,
    };
  },
  {
    persist: {
      key: "city-rpg-store",
      serializer: {
        serialize: (state: Record<string, unknown>) =>
          JSON.stringify({
            visitedStationIds: [...(state.visitedStationIds as Set<string>)],
            claimedDistrictBonuses: [...(state.claimedDistrictBonuses as Set<string>)],
          }),
        deserialize: (str: string) => {
          const raw = JSON.parse(str) as {
            visitedStationIds?: string[];
            claimedDistrictBonuses?: string[];
          };
          return {
            visitedStationIds: new Set<string>(raw.visitedStationIds ?? []),
            claimedDistrictBonuses: new Set<string>(raw.claimedDistrictBonuses ?? []),
          };
        },
      },
    },
  }
);
