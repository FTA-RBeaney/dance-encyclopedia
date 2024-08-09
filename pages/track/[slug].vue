<script setup>
const nuxtApp = useNuxtApp();
const getRecommendations = nuxtApp.getRecommendations;
const recommendations = await getRecommendations();
const spotifyId = ref("0eQrFxorPFvnaek7zJJIZH");
const spotifyPlayer = ref();

const { data: spotInfo } = await useFetch(
  `https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F${spotifyId.value}`
);
spotifyPlayer.value = spotInfo;
</script>

<template>
  <div class="flex">
    <div class="w-6/12">
      <div class="w-11/12 h-[500px]" v-html="spotifyPlayer.value.html"></div>
    </div>
    <div class="w-6/12">
      <Card class="p-4">
        Recommendations
        <p v-for="(rec, i) in recommendations.tracks" :key="`rec${i}`">
          {{ rec.name }}
        </p>
      </Card>
    </div>
  </div>
</template>
