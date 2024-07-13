<template>
  <NuxtLink :to="`/artist/${favourite.post_id}`">
    <Button variant="ghost" class="w-full justify-start font-normal">
      <IconsPlaylist />
      {{ artistData.name }}
    </Button>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  favourite: Object,
});

const artistFetchUrl = `https://musicbrainz.org/ws/2/artist/${props.favourite.post_id}?&fmt=json`;
const { data: artistData } = await useFetch(artistFetchUrl);
</script>
