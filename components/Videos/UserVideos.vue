<template>
  <div>
    <div class="flex items-center justify-between mt-4">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">User videos</h2>
        <p class="text-sm text-muted-foreground">
          A selection of user favourites!
        </p>
      </div>
    </div>
    <Separator class="my-4" />
    <div class="relative">
      <div class="flex">
        <div class="w-8/12">
          <div>
            <VideoPlayer
              v-if="chosenVideo"
              :video="chosenVideo"
              :poster="userVideoData?.snippet?.thumbnails.high.url"
            />
            <div v-else>
              <img
                src="https://i0.wp.com/blog.straycat.me.uk/wp-content/uploads/2024/02/Hellzapoppin-New-YT-Cover-2.png?fit=1116%2C714&ssl=1"
                class="w-full object-cover aspect-video rounded-lg"
              />
            </div>
          </div>
          <Card v-if="chosenVideo" class="p-4 mb-6 my-4">
            <div class="px-2">
              <h3
                class="font-semibold text-xl leading-none tracking-tight mt-2 mb-4"
              >
                {{ chosenVideoDetails.snippet.title }}
              </h3>

              <p class="text-sm text-muted-foreground my-2">
                {{ chosenVideoDetails.snippet.description }}
              </p>
              <h3 class="font-semibold leading-none tracking-tight mt-6">
                Tags:
              </h3>
              <ul class="flex flex-wrap mt-6">
                <li
                  v-for="(tag, i) in chosenVideoDetails.snippet.tags"
                  :key="`tag${i}`"
                  class="mr-2 mb-2"
                >
                  <Badge variant="secondary" class="rounded-md">
                    {{ tag }}
                  </Badge>
                </li>
              </ul>
            </div>
          </Card>
        </div>
        <div class="w-4/12 ml-4">
          <div v-if="userVideoData.length > 1" class="gap-4">
            <div
              v-for="(video, i) in userVideoData"
              :key="`video${i}`"
              class="rounded-sm overflow-hidden"
            >
              <div
                @click="changeVideo(video.id)"
                class="relative group cursor-pointer flex mb-2"
              >
                <div
                  class="rounded-lg overflow-hidden aspect-video h-24 max-w-36 min-w-36 mr-3"
                >
                  <img
                    :src="video.snippet.thumbnails.maxres.url"
                    class="h-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div class="mt-1">
                  <h3
                    class="text-sm font-medium leading-none tracking-tight max-w-full"
                  >
                    {{ video.snippet.title.substring(0, 50) + "…" }}
                  </h3>
                  <p class="text-xs font-medium text-muted-foreground mt-1">
                    {{ video.snippet.channelTitle }}
                  </p>
                  <p class="text-xs font-medium text-muted-foreground mt-1">
                    8 likes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const userVideos = ref();
const userVideoData = ref([]);
const gatherData = reactive([]);

import { RealtimeChannel } from "@supabase/supabase-js";

let realtimeChannel = RealtimeChannel;

const chosenVideo = ref(null);
const chosenVideoDetails = ref();

const fetchVideoData = async () => {
  gatherData.length = 0;

  for (const item in userVideos.value) {
    var videoURL = userVideos.value[item].url;
    let regex =
      /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    var videoId = regex.exec(videoURL)[3];

    const videoArray = await getVideoDetails(videoId);

    gatherData.push(videoArray.items[0]);
  }

  userVideoData.value = gatherData;
};

const changeVideo = (id) => {
  chosenVideo.value = `https://www.youtube.com/watch?v=${id}`;
  chosenVideoDetails.value = userVideoData.value.find(
    (video) => video.id === id
  );
};

const { data, refresh } = await useAsyncData("userVideos", async () => {
  try {
    const { data: videos, error } = await supabase.from("videos").select();
    userVideos.value = videos;
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  }

  await fetchVideoData();
});

realtimeChannel = supabase.channel("videos").on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "videos",
  },

  () => refresh()
);
realtimeChannel.subscribe();

onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});

console.log(userVideoData);
</script>
