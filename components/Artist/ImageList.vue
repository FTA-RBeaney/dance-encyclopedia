<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Images</h2>
        <p class="text-sm text-muted-foreground">Various images</p>
      </div>
    </div>
    <Separator class="my-4" />
    <ScrollArea class="w-[100%] whitespace-nowrap mb-4">
      <div v-if="!isLoaded" class="flex space-x-4 pb-4">
        <div
          v-for="(media, index) in wikiMedia"
          :key="`wikimedia-${index}`"
          class="animate-pulse flex items-center justify-center w-full h-64 bg-gray-300 rounded aspect-[3/4] dark:bg-gray-700"
        >
          <svg
            class="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
            />
          </svg>
        </div>
      </div>
      <div v-else class="flex space-x-4 pb-4">
        <figure
          v-for="(media, index) in wikiMedia"
          :key="`wikimedia-${index}`"
          class="shrink-0"
          :class="!media.srcset && 'hidden'"
        >
          <Dialog>
            <DialogTrigger v-if="media?.srcset">
              <div class="overflow-hidden rounded-md">
                <img
                  :src="media.srcset[0].src"
                  class="aspect-[3/4] h-64 w-fit object-cover"
                />
              </div>
            </DialogTrigger>
            <DialogContent class="w-auto">
              <img
                :src="media.srcset[0].src"
                class="aspect-[3/4] h-94 w-fit sm:min-w-[425px] object-cover"
              />
              <Label v-if="media.caption" class="text-center">{{
                media.caption.text
              }}</Label>
            </DialogContent>
          </Dialog>
        </figure>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>

<script setup>
const props = defineProps({
  artistName: String,
});

const wikiMedia = ref([]);

const { artistName } = props;
const isLoaded = ref(false);

var mediaUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${artistName}`;

const { data, error } = useFetch(mediaUrl, {
  onResponse({ response }) {
    isLoaded.value = true;
    wikiMedia.value = response._data.items;
  },
});
</script>
