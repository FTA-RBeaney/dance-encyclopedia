<template>
  <div class="flex flex-col sm:flex-row mt-1 dark:text-white">
    <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
      <img
        v-if="wikiInfo[0].wiki_data.thumbnail"
        class="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
        :src="wikiInfo[0]?.wiki_data.thumbnail?.source"
        alt="Rounded avatar"
      />

      <div class="flex flex-col items-center text-center justify-center">
        <h2
          class="font-medium title-font mt-4 text-gray-900 dark:text-white text-lg"
        >
          {{ wikiInfo[0].wiki_data.title }}
        </h2>
        <div class="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
        <p class="text-base">
          {{ wikiInfo[0].wiki_data.description }}
        </p>
      </div>
    </div>
    <div
      class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left"
    >
      <p class="leading-relaxed text-lg mb-4">
        {{ wikiInfo[0].wiki_data.extract }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  musician: Object,
  wikiInfo: Object,
});
</script>
