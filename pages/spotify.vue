<template>
  <div class="px-4 py-6">
    <Heading
      :title="everything.name"
      :description="everything.disambiguation"
    />
    <Separator class="my-4" />
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
  </div>

  <!-- <ul>
      <li v-for="track in album.media[0].tracks" :key="track.id">
        {{ track.title }}
        <img class="w-32" :src="img" />
      </li>
    </ul> -->

  <!-- <pre>{{ album }}</pre> -->
</template>

<script setup>
const albumList = [
  "f28c755a-bb60-4251-8f4f-693c950cbd1e",
  "fef80dc2-506e-47f4-8819-15b4b5f8479a",
];

const mbid = "f28c755a-bb60-4251-8f4f-693c950cbd1e";
const url = `https://musicbrainz.org/ws/2/release/${mbid}?inc=aliases%2Bartist-credits%2Brecordings&fmt=json`;
const img = `https://coverartarchive.org/release/${mbid}/front `;
const { data: album } = await useFetch(url);

const allTheAlbums = [];
const allTheImages = [];
const albums = ref([]);
const images = ref([]);

const dukeEllington = "3af06bc4-68ad-4cae-bb7a-7eeeb45e411f";

const megaList = `https://musicbrainz.org/ws/2/artist/${dukeEllington}?inc=release-groups&fmt=json`;
const { data: everything } = await useFetch(megaList);

everything.value["release-groups"].forEach((item) => {
  const img = `https://coverartarchive.org/release-group/${item.id}/front`;
  allTheImages.push(img);
});

albumList.forEach((element) => {
  const url = `https://musicbrainz.org/ws/2/release/${element}?inc=aliases%2Bartist-credits%2Blabels%2Bdiscids%2Brecordings&fmt=json`;
  allTheAlbums.push(url);
});

Promise.all(allTheAlbums.map((url) => fetch(url).then((r) => r.json())))
  .then(([...stats]) => {
    albums.value = stats;
  })
  .catch((error) => console.log(error));

const artistName = computed(() => album.value["artist-credit"][0].artist.name);
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
