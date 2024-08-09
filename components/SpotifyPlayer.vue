<script setup>
const props = defineProps({
  songId: String,
});
const nuxtApp = useNuxtApp();
const getRecommendations = nuxtApp.getRecommendations;
const recommendations = await getRecommendations();
const spotifyId = ref(props.songId);
const spotifyPlayer = ref();

const { data: spotInfo } = await useFetch(
  `https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F${spotifyId.value}`
);
spotifyPlayer.value = spotInfo;
</script>

<template>
  <div class="flex">
    <div class="w-6/12">
      <div class="w-11/12" v-html="spotifyPlayer.value.html"></div>
    </div>
    <div class="w-6/1 border-gray-200 border-l pl-8 pt-2">
      <p class="font-semibold mb-2">Similar songs:</p>
      <ul
        v-for="(rec, i) in recommendations.tracks"
        :key="`rec${i}`"
        class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400"
      >
        <li>
          {{ rec.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
