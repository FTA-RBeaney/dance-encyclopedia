<template>
  <div>
    <div class="relative">
      <div class="grid-container">
        <div v-for="(item, i) in response?.items" :key="`item${i}`">
          <NuxtLink
            :to="`/album/${item.id}`"
            class="space-y-3 mb-4"
            aspect-ratio="square"
          >
            <div class="overflow-hidden rounded-md">
              <img
                :src="item.images[0].url"
                format="webp"
                preload
                loading="lazy"
                placeholder="https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png"
                :alt="item.title"
                width="300"
                height="300"
                class="h-full w-full object-cover transition-all hover:scale-105 aspect-square"
              />
            </div>
            <div class="space-y-1 text-sm">
              <h3 class="font-medium leading-none">
                {{ item.name }}
              </h3>
              <p class="text-xs text-muted-foreground">
                {{ item.release_date }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ item.total_tracks }} tracks
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  artistSpotifyId: String,
});

const nuxtApp = useNuxtApp();
const route = useRoute();

const getArtistAlbums = nuxtApp.getArtistAlbums;
const playlistId = route.params.slug;
const response = ref();

const res = await getArtistAlbums(props.artistSpotifyId);
response.value = res;
</script>

<style lang="scss" scoped>
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
