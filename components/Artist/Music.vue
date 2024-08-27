<template>
  <div>
    <div>
      <CardHeader class="flex flex-row justify-between">
        <div>
          <CardTitle> Albums </CardTitle>
          <CardDescription> A list of albums </CardDescription>
        </div>
        <div class="flex items-center gap-4">
          <p class="text-gray-500 text-sm">
            Showing {{ response.offset + 1 }}-{{
              response.offset + response.limit
            }}/{{ response.total }}
          </p>
          <Button v-if="response.previous" @click="nextSpotify('previous')"
            >Prev</Button
          >
          <Button
            v-if="response.next && response.items.length > 0"
            @click="nextSpotify('next')"
            >Next</Button
          >
        </div>
      </CardHeader>
    </div>
    <CardContent>
      <div class="relative">
        <!-- <pre>{{ response }}</pre> -->
        <div class="grid grid-cols-5 gap-4">
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
    </CardContent>
  </div>
</template>

<script setup>
const props = defineProps({
  artistSpotifyId: String,
});

const nuxtApp = useNuxtApp();
const route = useRoute();

const getArtistAlbums = nuxtApp.getArtistAlbums;
const getNextAlbums = nuxtApp.getNextAlbums;
const playlistId = route.params.slug;
const response = ref();

const res = await getArtistAlbums(props.artistSpotifyId);
response.value = res;

const nextSpotify = async (direction) => {
  console.log(direction);
  response.value = await getNextAlbums(response.value[direction]);

  console.log(response.value);
};
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
