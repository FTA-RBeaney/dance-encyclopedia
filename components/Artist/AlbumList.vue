<template>
  <div class="relative">
    <div class="grid-container">
      <ArtistAlbum
        v-for="(item, index) in everything['release-groups']"
        :item="item"
        :key="`${item.name}-${index}`"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  everything: Object,
  allTheImages: Object,
});
</script>

<style scoped>
.grid-container {
  /**
   * User input values.
   */
  --grid-layout-gap: 10px;
  --grid-column-count: 6;
  --grid-item--min-width: 100px;

  /**
   * Calculated values.
   */
  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc(
    (100% - var(--total-gap-width)) / var(--grid-column-count)
  );

  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr)
  );
  grid-gap: var(--grid-layout-gap);
}
</style>
