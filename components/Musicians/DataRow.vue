<template>
  <TableRow>
    <NuxtLink :to="`/artist/${artistId}`">
      <slot />
    </NuxtLink>
  </TableRow>
</template>

<script setup>
const props = defineProps({
  artistId: String,
  musician: Object,
});

// const key = props.musician.name.trim().replace(/'/g, "%27").replace(/ /g, "_");
// var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
// const { data: wikiInfo } = await useFetch(url);
</script>

<style scoped>
tr > a {
  display: contents;
}
</style>
