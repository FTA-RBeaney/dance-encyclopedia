<template>
  <NuxtLink :to="`/artist/${postId}`" class="max-w-full">
    <Button variant="ghost" class="w-full justify-start font-normal">
      <IconsMicrophone />
      <p class="truncate">{{ name }}</p>
    </Button>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  postId: String,
  name: String,
});

const artistFetchUrl = `https://musicbrainz.org/ws/2/artist/${props.postId}?&fmt=json`;
const { data: artistData } = await useFetch(artistFetchUrl);
</script>
