<template>
  <div class="district-detail-view">
    <!-- Placeholder: implemented in Slice 3 -->
    <p class="placeholder-text">🏙️ {{ $route.params.id }} — 區域詳細頁</p>
    <router-link to="/rpg" class="back-link">← 返回冒險地圖</router-link>
  </div>
</template>

<script setup lang="ts">
// Slice 3 delivers the full DistrictDetailView implementation.
// $route.params.id is used directly in the template above.
</script>

<style scoped>
.district-detail-view {
  padding: var(--spacing-xl);
}

.placeholder-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.back-link {
  display: block;
  color: var(--color-rpg-accent);
  text-align: center;
  text-decoration: none;
  font-size: var(--font-size-body);
}
</style>
