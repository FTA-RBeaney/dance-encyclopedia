<template>
  <div class="flex flex-col sm:flex-row mt-1">
    <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
      <img
        v-if="wikiInfo.thumbnail"
        class="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
        :src="wikiInfo?.thumbnail?.source"
        alt="Rounded avatar"
      />

      <div class="flex flex-col items-center text-center justify-center">
        <h2 class="font-medium title-font mt-4 text-gray-900 text-lg">
          {{ wikiInfo.title }}
        </h2>
        <div class="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
        <p class="text-base">
          {{ wikiInfo.description }}
        </p>
        <div class="mt-4 w-full">
          <!-- <a
          v-if="musician.wikipedia_link"
          :href="musician.wikipedia_link"
          target="_blank"
          class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 w-full justify-center"
        >
          View on Wikipedia
          <IconsWikipedia />>
        </a>
        <a
          v-if="musician.spotify_link"
          :href="musician.spotify_link"
          target="_blank"
          class="text-white bg-[#24292F] bg-green-500 hover:bg-green-500/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mt-2 w-full justify-center"
        >
          View on Spotify
          <IconsSpotify />
        </a> -->
        </div>
      </div>
    </div>
    <div
      class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left"
    >
      <p class="leading-relaxed text-lg mb-4">
        {{ wikiInfo.extract }}
      </p>
      <a
        class="text-indigo-500 inline-flex items-center"
        :href="wikiInfo.content_urls.desktop.page"
        >Learn More
        <IconsWikipedia />
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  musician: Object,
  wikiInfo: Object,
});
</script>
