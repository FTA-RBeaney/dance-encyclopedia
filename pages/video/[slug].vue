<script setup>
import { videoList } from "../data/videos";
import "vidstack/bundle";
const supabase = useSupabaseClient();

const route = useRoute();

const chosenVideo = ref();
const video = ref();
const readMoreActive = ref(true);

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
</script>

<template>
  <div>
    <Heading :title="route.params.slug" />
    <div class="flex w-full items-start mt-4">
      <div class="w-8/12 mr-4">
        <VideoPlayer
          v-if="chosenVideo?.fullVideo"
          :video="chosenVideo.fullVideo"
          :poster="chosenVideo.cover"
        />

        <div
          class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full overflow-hidden p-4 mt-4"
        >
          <p class="py-2 text-xl font-semibold">About</p>
          <div
            v-if="readMoreActive && video.parse.title != 'Undefined'"
            v-html="video?.parse?.text['*']"
          ></div>
          <div v-else><p>No information yet</p></div>
        </div>
      </div>
      <div class="w-4/12">
        <div
          class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full overflow-hidden px-4 py-2 mt-4 lg:mt-0"
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
        </div>
      </div>
    </div>
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
