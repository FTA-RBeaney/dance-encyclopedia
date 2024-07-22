<template>
  <div class="mt-1">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Albums</h2>
        <p class="text-sm text-muted-foreground">A list of all the albums</p>
      </div>
    </div>
    <Separator class="my-4" />
    <div class="relative">
      <div class="grid-container">
        <ArtistAlbum
          v-for="(item, index) in albumData['release-groups']"
          :item="item"
          :key="`${item.name}-${index}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  artistId: String,
  allTheImages: Object,
});

const { artistId } = props;

const albumsUrl = `https://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=album&limit=100`;
const { data: albumData } = await useFetch(albumsUrl, {
  pick: ["release-groups"],
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
