<template>
  <TableRow>
    <NuxtLink :to="`/artist/${artistId}`">
      <TableCell class="font-medium">
        <img
          v-if="wikiInfo.thumbnail"
          class="w-8 h-8 mr-2 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
          :src="wikiInfo?.thumbnail?.source"
          alt="Rounded avatar"
        />
        {{ artistData.name }}
      </TableCell>
      <TableCell>{{ artistData.country }}</TableCell>
      <TableCell>{{ artistData["life-span"].begin }}</TableCell>
      <TableCell> {{ artistData["life-span"].end }}</TableCell
      ><TableCell class="font-bold text-right">View details</TableCell>
    </NuxtLink>
  </TableRow>
</template>

<script setup>
const props = defineProps({
  artistId: String,
});

const artistFetchUrl = `https://musicbrainz.org/ws/2/artist/${props.artistId}?&fmt=json`;
const { data: artistData } = await useFetch(artistFetchUrl);

console.log(artistData);
const key = artistData.value.name
  .trim()
  .replace(/'/g, "%27")
  .replace(/ /g, "_");
var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
const { data: wikiInfo } = await useFetch(url);
</script>

<style scoped>
tr > a {
  display: contents;
}
</style>
