<template>
  <div>
    <Heading v-if="response?.name" :title="response.name" />

    <a
      v-if="response?.external_urls?.spotify"
      :href="response?.external_urls?.spotify"
      target="_blank"
      class="inline-flex justify-center items-center text-xs px-8 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 mb-4"
      >Listen on Spotify <IconsSpotify
    /></a>

    <PlaylistTrackListing :tracks="response?.tracks?.items" />
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();
const route = useRoute();

const getNowPlaying = nuxtApp.getNowPlaying;
const playlistId = route.params.slug;
const response = ref();

const res = await getNowPlaying(playlistId);
response.value = res;
</script>
