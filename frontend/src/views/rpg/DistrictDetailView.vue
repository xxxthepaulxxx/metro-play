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
      <!-- UnlockBurstAnimation placeholder — wired in Slice 4 -->
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DISTRICTS } from "../../api/mockData";
// biome-ignore lint/correctness/noUnusedImports: used as component in template
import DistrictDetailCard from "../../components/DistrictDetailCard.vue";
import { useCityRpgStore } from "../../stores/cityRpg";

const route = useRoute();
const router = useRouter();
// biome-ignore lint/correctness/noUnusedVariables: used in template
const store = useCityRpgStore();

const id = computed(() => route.params.id as string);

// biome-ignore lint/correctness/noUnusedVariables: used in template
const district = computed(() => {
  const found = DISTRICTS.find((d) => d.id === id.value);
  if (!found) {
    router.push("/rpg");
    return null;
  }
  return found;
});
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
</style>
