<template>
  <div class="city-rpg-map-view">
    <header class="page-header">
      <h1 class="page-title">🗺️ 城市RPG</h1>
    </header>

    <section class="progress-hero glass-card" aria-label="overall progress">
      <div class="hero-stat">
        <span class="hero-number">{{ store.overallProgress.unlocked }}</span>
        <span class="hero-sep">/</span>
        <span class="hero-number">{{ store.overallProgress.total }}</span>
        <span class="hero-label">個區域已解鎖</span>
      </div>
      <div class="hero-bonus">
        <span class="bonus-label">已獲獎勵</span>
        <span class="bonus-value">+{{ store.totalBonusEarned }} pts</span>
      </div>
    </section>

    <section class="district-list" aria-label="district list">
      <DistrictCard
        v-for="district in districts"
        :key="district.id"
        :name="district.name"
        :visited="store.districtProgress(district.id).visited"
        :total="district.stations.length"
        :threshold="district.threshold"
        :is-unlocked="store.isDistrictUnlocked(district.id)"
        :bonus-points="district.bonusPoints"
        @click="router.push(`/rpg/district/${district.id}`)"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchDistricts } from "../../api/mockApi";
import type { RpgDistrict } from "../../api/mockData";
// biome-ignore lint/correctness/noUnusedImports: used as component in template
import DistrictCard from "../../components/DistrictCard.vue";
import { useCityRpgStore } from "../../stores/cityRpg";

// biome-ignore lint/correctness/noUnusedVariables: used in template
const store = useCityRpgStore();
// biome-ignore lint/correctness/noUnusedVariables: used in template
const router = useRouter();
const districts = ref<RpgDistrict[]>([]);

onMounted(async () => {
  districts.value = await fetchDistricts();
});
</script>

<style scoped>
.city-rpg-map-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.glass-card {
  background: var(--color-glass-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  backdrop-filter: var(--blur-card);
  -webkit-backdrop-filter: var(--blur-card);
  padding: var(--spacing-lg);
}

.progress-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-stat {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.hero-number {
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-black);
  color: var(--color-rpg-accent);
}

.hero-sep {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.hero-label {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin-left: var(--spacing-xs);
}

.hero-bonus {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.bonus-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.bonus-value {
  font-size: var(--font-size-subtitle);
  font-weight: var(--font-weight-bold);
  color: var(--color-rpg-accent);
}

.district-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
