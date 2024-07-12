<template>
  <div class="relative">
    <div class="grid-container">
      <a
        v-for="(item, index) in everything['release-groups']"
        :key="`${item}+${index}`"
        href="google"
        class="space-y-3 mb-4"
        aspect-ratio="square"
        target="_blank"
      >
        <div class="overflow-hidden rounded-md">
          <img
            :src="allTheImages[index]"
            @error="
              $event.target.src =
                'https://archive.org/download/placeholder-image/placeholder-image.jpg'
            "
            :alt="item.title"
            width="150px"
            height="150px"
            class="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
          />
        </div>
        <div class="space-y-1 text-sm">
          <h3 class="font-medium leading-none">
            {{ item.title }}
          </h3>
          <p class="text-xs text-muted-foreground">
            {{ item["first-release-date"] }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  everything: Object,
  allTheImages: Object,
});
const imageLoadError = () => {
  console.log("image error");
};
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
