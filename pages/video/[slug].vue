<script setup>
import { videoList } from "../data/videos";
import "vidstack/bundle";
const supabase = useSupabaseClient();

const route = useRoute();

const chosenVideo = ref();
const video = ref();
const readMoreActive = ref(false);

const dancerIds = [
  "b837e540-a5a7-41d0-b957-a6d8448b003c",
  "683779b8-c972-4ee2-8d86-9ed2686fd9a1",
  "5b3160ab-ec9a-4e0d-9e62-183013924e94",
  "3aea51cb-fbfa-435b-8579-ef3146743e65",
  "4492ba00-9124-4e17-a565-a2043a8ae51e",
  "cdc985c2-f01f-4fb6-813b-aabb8589f6b8",
  "66fc8971-4321-496f-bca0-5a637d615804",
  "4ef8c25c-af5d-471b-b7eb-1cb40b3ee601",
  "3756148c-687b-4f43-8df1-f43f928d4293",
  "302da88c-6cb4-4cf6-8ae9-1f7e023609a3",
];
const { data: dancers } = await supabase
  .from("dancers")
  .select()
  .in("id", dancerIds);

chosenVideo.value = videoList.find((e) => e.name === route.params.slug);

var mediaUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${chosenVideo.value.wikiLink}&prop=text&origin=*`;

const { data, error } = await useFetch(mediaUrl);

video.value = data.value;

if (error.value) {
  console.log("ERROR", error.value);
}

const activateReadMore = () => {
  readMoreActive.value = !readMoreActive.value;
};
</script>

<template>
  <div>
    <Heading :title="route.params.slug" />
    <div class="flex w-full items-start">
      <div class="w-8/12 mr-4">
        <VideoPlayer v-if="chosenVideo?.fullVideo" :video="chosenVideo" />
        <div
          class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full overflow-hidden p-4 mt-4"
        >
          <p class="py-2 text-xl font-semibold">About</p>
          <div v-if="!readMoreActive">
            <div class="truncate">
              <div v-html="video?.parse?.text['*'].slice(0, 1500)"></div>
            </div>
            <Button
              variant="ghost"
              class="text-primary p-0"
              @click.prevent="activateReadMore"
              >Read more...
            </Button>
          </div>
          <div v-else>
            <div
              v-if="video.parse.title != 'Undefined'"
              v-html="video?.parse?.text['*']"
            ></div>
            <div v-else><p>No information yet</p></div>
          </div>
          <!-- <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>History</AccordionTrigger>
              <AccordionContent> </AccordionContent>
            </AccordionItem>
          </Accordion> -->
        </div>
      </div>
      <div class="w-4/12">
        <div
          class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full overflow-hidden px-4 py-2 mt-4"
        >
          <p class="py-2 text-xl font-semibold">Dancers</p>
          <Table>
            <TableBody>
              <TableRow
                v-for="(dancer, index) in dancers"
                :dancer="dancer"
                :key="`dancer-${index}`"
              >
                <NuxtLink :to="`/dancer/${dancer.name}`">
                  <TableCell class="font-medium p-0 py-4">
                    <img
                      v-if="dancer?.image"
                      class="w-8 h-8 mr-2 rounded-md inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
                      :src="dancer?.image"
                      alt="Rounded avatar"
                    />
                    {{ dancer?.name }}
                  </TableCell>
                </NuxtLink>
              </TableRow>
            </TableBody>
          </Table>
          <!-- <DancerCard
            v-for="(dancer, index) in dancers"
            :dancer="dancer"
            :key="`dancer-${index}`"
          /> -->
        </div>
      </div>
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
  ul,
  .mw-default-size,
  .box-Unreferenced_section,
  .box-More_citations_needed {
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
