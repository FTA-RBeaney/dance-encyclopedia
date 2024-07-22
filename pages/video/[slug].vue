<script setup>
import { videoList, otherVideos } from "../data/videos";
import "vidstack/bundle";

const route = useRoute();
const props = defineProps({
  media: Array,
});

const chosenVideo = ref();

chosenVideo.value = videoList.find((e) => e.name === route.params.slug);

var mediaUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${chosenVideo.value.wikiLink}&prop=text`;

const response = ref();
const wikiMedia = ref();

const { data, error } = useFetch(mediaUrl);
console.log(data);
wikiMedia.value = data;
</script>

<template>
  <div>
    <Heading :title="route.params.slug" />
    <Player :video="chosenVideo.fullVideo" />
    <div
      class="max-w-100 mx-auto bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden p-4 mt-4"
    >
      <div v-html="wikiMedia?.value.parse?.text['*']"></div>
    </div>
    <!-- <div>
      <div class="">
        <div class="flex flex-col sm:flex-row mt-1">
          <div
            class="sm:w-2/3 text-center sm:pr-8 bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden"
          >
            <div
              class="outline-none"
              :tabindex="0"
              autofocus
              @keydown.prevent.space="playing = !playing"
              @keydown.right="currentTime += 10"
              @keydown.left="currentTime -= 10"
            >
              <div class="relative bg-black rounded-md shadow overflow-hidden">
                <video
                  ref="video"
                  crossorigin="anonymous"
                  class="w-full block"
                  :poster="poster"
                  :loop="loop"
                  @click="playing = !playing"
                />
                <div
                  v-if="waiting"
                  class="absolute inset-0 grid place-items-center pointer-events-none bg-black bg-opacity-20"
                >
                  <VideoPlayerSpinner />
                </div>
              </div>

              <VideoPlayerScrubber
                v-model="currentTime"
                :max="duration"
                :secondary="endBuffer"
                class="mt-2"
              >
                <template #default="{ position, pendingValue }">
                  <div
                    class="absolute transform -translate-x-1/2 bg-black rounded px-2 bottom-0 mb-4 py-1 text-xs text-white"
                    :style="{ left: position }"
                  >
                    {{ formatDuration(pendingValue) }}
                  </div>
                </template>
              </VideoPlayerScrubber>

              <div class="flex flex-row items-center items-center">
                <button @click="playing = !playing" class="w-6 h-6">
                  <IconsPlay v-if="!playing" />
                  <IconsPause v-else />
                </button>
                <button @click="muted = !muted">
                  <i
                    v-if="muted"
                    i-carbon-volume-mute
                    inline-block
                    align-middle
                  />
                  <i v-else i-carbon-volume-up inline-block align-middle />
                </button>
                <VideoPlayerScrubber
                  v-model="volume"
                  :max="1"
                  class="w-32 ml-2"
                />
                <div class="flex flex-col flex-1 text-sm ml-2">
                  {{ formatDuration(currentTime) }} /
                  {{ formatDuration(duration) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="flex p-5">
      <ScriptYouTubePlayer ref="video" :video-id="chosenVideo.videoId" class="group" @ready="isLoaded = true" @state-change="stateChange">
        <template #awaitingLoad>
          <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[48px] w-[68px] text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 18.3915V5.60846L18.2264 12L8 18.3915ZM6 3.80421V20.1957C6 20.9812 6.86395 21.46 7.53 21.0437L20.6432 12.848C21.2699 12.4563 21.2699 11.5436 20.6432 11.152L7.53 2.95621C6.86395 2.53993 6 3.01878 6 3.80421Z"></path></svg>
          </div>
        </template>
      </ScriptYouTubePlayer>
    </div> -->

    <!-- <vue-plyr>
        <div class="plyr__video-embed relative">
          <iframe
            src="https://www.youtube.com/embed/bTqVqk7FSmY?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          ></iframe>
        </div>
      </vue-plyr> -->
  </div>
</template>

<style lang="scss">
.mw-content-ltr.mw-parser-output {
  p {
    margin-bottom: 1rem;
  }

  .reflist,
  #External_links,
  #Notes,
  #References,
  ul {
    display: none;
  }
}
.mw-heading {
  h2 {
    font-size: 1.6rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 1.2rem;
    margin-bottom: 1rem;
  }

  .mw-editsection {
    display: none;
  }
}
</style>
