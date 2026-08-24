<template>
  <div class="district-detail-view">
    <header class="page-header">
      <router-link to="/rpg" class="back-link" aria-label="返回冒險地圖">← 返回</router-link>
      <h1 class="page-title">區域詳細</h1>
    </header>

    <template v-if="district">
      <DistrictDetailCard
        :name="district.name"
        :stations="district.stations"
        :visited-ids="store.visitedStationIds"
        :threshold="district.threshold"
        :bonus-points="district.bonusPoints"
        :is-unlocked="store.isDistrictUnlocked(district.id)"
      />

      <button class="visit-btn" :disabled="isBtnDisabled" @click="onVisit">
        {{ btnLabel }}
      </button>

      <UnlockBurstAnimation :active="showUnlock" @done="showUnlock = false" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DISTRICTS } from "../../api/mockData";
// biome-ignore lint/correctness/noUnusedImports: used as component in template
import DistrictDetailCard from "../../components/DistrictDetailCard.vue";
// biome-ignore lint/correctness/noUnusedImports: used as component in template
import UnlockBurstAnimation from "../../components/UnlockBurstAnimation.vue";
import { useCityRpgStore } from "../../stores/cityRpg";

const route = useRoute();
const router = useRouter();
const store = useCityRpgStore();

const id = computed(() => route.params.id as string);

const district = computed(() => {
  const found = DISTRICTS.find((d) => d.id === id.value);
  if (!found) {
    router.push("/rpg");
    return null;
  }
  return found;
});

const nextUnvisited = computed(() => {
  const d = district.value;
  if (!d) return null;
  return d.stations.find((s) => !store.visitedStationIds.has(s.id)) ?? null;
});

// biome-ignore lint/correctness/noUnusedVariables: used in template
const isBtnDisabled = computed(() => {
  const d = district.value;
  if (!d) return true;
  return store.claimedDistrictBonuses.has(d.id) || nextUnvisited.value === null;
});

// biome-ignore lint/correctness/noUnusedVariables: used in template
const btnLabel = computed(() => {
  const station = nextUnvisited.value;
  return station ? `模擬進站 — ${station.name}` : "全部已造訪";
});

const showUnlock = ref(false);

// biome-ignore lint/correctness/noUnusedVariables: used in template
async function onVisit() {
  const d = district.value;
  const station = nextUnvisited.value;
  if (!d || !station) return;
  await store.addVisit(station.id);
  if (store.isDistrictUnlocked(d.id) && !store.claimedDistrictBonuses.has(d.id)) {
    store.claimBonus(d.id);
    showUnlock.value = true;
  }
}
</script>

<style scoped>
.district-detail-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.back-link {
  color: var(--color-rpg-accent);
  text-decoration: none;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

.page-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.visit-btn {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-rpg-accent);
  color: #000;
  border: none;
  border-radius: var(--radius-card);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--timing-ease-out);
}

.visit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
