<template>
  <TableRow>
    <NuxtLink :to="`/artist/${artistId}`">
      <TableCell class="font-medium">
        <img
          v-if="wikiInfo?.thumbnail"
          class="w-8 h-8 mr-2 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
          :src="wikiInfo?.thumbnail?.source"
          alt="Rounded avatar"
        />
        {{ wikiInfo.titles.normalized }}
      </TableCell>
      <TableCell>{{ wikiInfo.description }}</TableCell>
      <TableCell class="font-bold text-right">View details</TableCell>
    </NuxtLink>
  </TableRow>
</template>

<script setup>
const props = defineProps({
  artistId: String,
  musician: Object,
});

const key = props.musician.name.trim().replace(/'/g, "%27").replace(/ /g, "_");
var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
const { data: wikiInfo } = await useFetch(url);
</script>

<style scoped>
tr > a {
  display: contents;
}
</style>
