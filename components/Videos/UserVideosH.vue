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
      let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
      var videoId = regex.exec(videoURL)[3];

      const videoArray = await getVideoDetails(videoId);

      gatherData.push(videoArray.items[0]);
    }

    userVideoData.value = gatherData;
  };

  const changeVideo = (id) => {
    chosenVideo.value = `http://youtube.googleapis.com/v/${id}?start=15&end=20&version=3`;
    chosenVideoDetails.value = userVideoData.value.find((video) => video.id === id);
  };

  const { data, refresh } = await useAsyncData("userVideosH", async () => {
    try {
      const { data: videos, error } = await supabase.from("videos").select();
      userVideos.value = videos;
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }

    fetchVideoData();
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
</script>

<template>
  <div>
    <div class="relative">
      <div
        v-if="userVideoData.length > 1"
        class="flex gap-4">
        <div
          v-for="(video, i) in userVideoData"
          :key="`video${i}`"
          class="rounded-sm overflow-hidden w-[20%]">
          <Dialog>
            <div class="relative group cursor-pointer mb-2">
              <div class="rounded-lg overflow-hidden aspect-video mr-3">
                <img
                  :src="video.snippet.thumbnails.maxres.url"
                  class="h-full object-cover transition-all hover:scale-105" />
              </div>
              <div class="mt-3">
                <DialogTrigger as-child>
                  <h3 class="text-sm font-medium leading-none tracking-tight max-w-full">
                    {{ video.snippet.title.substring(0, 50) + "…" }}
                  </h3>
                </DialogTrigger>
                <p class="text-xs font-medium text-muted-foreground mt-1">
                  {{ video.snippet.channelTitle }}
                </p>
                <div>
                  <Badge
                    v-for="tag in userVideos[i].tags"
                    class="rounded-md mt-2">
                    {{ tag }}
                  </Badge>
                </div>
                <!-- <p class="text-xs font-medium text-muted-foreground mt-1">8 likes</p> -->
              </div>
            </div>

            <DialogContent class="sm:max-w-[1400px] max-h-[800px]">
              <div class="flex max-h-[400px]">
                <div class="w-5/12">
                  <VideoPlayer
                    :video="`https://www.youtube.com/v/${video.id}`"
                    :poster="userVideoData?.snippet?.thumbnails.high.url"
                    :start="userVideos[i].start"
                    :end="userVideos[i].end"
                    :tags="userVideos[i].tags" />
                </div>
                <div class="px-6 w-7/12">
                  <h3 class="font-semibold text-xl leading-none tracking-tight mt-2 mb-4">
                    {{ video?.snippet?.title }}
                  </h3>

                  <p class="text-sm text-muted-foreground my-2">
                    {{ video?.snippet?.description }}
                  </p>
                  <h3 class="font-semibold leading-none tracking-tight mt-6">Tags:</h3>
                  <ul class="flex flex-wrap mt-6">
                    <li
                      v-for="(tag, i) in video?.snippet?.tags"
                      :key="`tag${i}`"
                      class="mr-2 mb-2">
                      <Badge
                        variant="secondary"
                        class="rounded-md">
                        {{ tag }}
                      </Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>
