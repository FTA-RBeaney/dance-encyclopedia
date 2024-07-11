<template>
  <div class="px-4 py-6">
    <div class="flex justify-between">
      <Heading
        :title="everything.name"
        :description="everything.disambiguation"
      />
    </div>

    <Separator class="my-4" />
    <section class="text-gray-600 body-font">
      <div class="container flex flex-col">
        <div class="lg:w-5/6">
          <ArtistDetail :wikiInfo="wikiInfo" />
        </div>
      </div>
    </section>

    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Albums</h2>
        <p class="text-sm text-muted-foreground">A list of all the albums</p>
      </div>
    </div>
    <Separator class="my-4" />
    <ArtistAlbumList :everything="everything" :allTheImages="allTheImages" />

    <div class="bottom-drawer">
      <div class="h-2 bg-red-light"></div>
      <div class="inline-flex items-center justify-center bg-red-lightest">
        <div class="shadow-lg rounded-lg">
          <div v-html="spotInfoHtml"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const mbid = "f28c755a-bb60-4251-8f4f-693c950cbd1e"; //this is hard coded value for now - DELETE THIS

// inject the MBID into the fetch URL
const url = `https://musicbrainz.org/ws/2/release/${mbid}?inc=aliases%2Bartist-credits%2Brecordings&fmt=json`;
// use the same MBID to get the album images
const img = `https://coverartarchive.org/release/${mbid}/front `;

const allTheAlbums = [];
const allTheImages = [];
const albums = ref([]);

// duke link: https://musicbrainz.org/ws/2/artist/3af06bc4-68ad-4cae-bb7a-7eeeb45e411f?inc=release-groups%2Burl-rels&fmt=json

const dukeEllington = "3af06bc4-68ad-4cae-bb7a-7eeeb45e411f";

const megaList = `https://musicbrainz.org/ws/2/artist/${dukeEllington}?inc=release-groups%2Burl-rels&fmt=json`;
const { data: everything } = await useFetch(megaList);

const key = everything.value.name
  .trim()
  .replace(/'/g, "%27")
  .replace(/ /g, "_");
var wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
const { data: wikiInfo } = await useFetch(wikiUrl);

everything.value["release-groups"].forEach((item) => {
  const img = `https://coverartarchive.org/release-group/${item.id}/front`;
  allTheImages.push(img);
});

// Promise.all(
//   allTheAlbums.map((url) => fetch(url).then((r) => console.log(r.json())))
// )
//   .then(([...stats]) => {
//     albums.value = stats;
//   })
//   .catch((error) => console.log(error));

const filteredItems = everything.value.relations.filter((item) => {
  return item.url.resource.includes("spotify");
});

const spotifyLink =
  "https://open.spotify.com/oembed?url=" + filteredItems[0].url.resource;

const { data: spotInfo } = await useFetch(spotifyLink);
const spotInfoHtml = spotInfo.value.html;
</script>

<style>
iframe {
  height: 82px;
  width: 300px;
}

.bottom-drawer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: auto;
  height: auto;
}
</style>
