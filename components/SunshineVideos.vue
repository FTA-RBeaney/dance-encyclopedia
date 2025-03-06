<script setup>
  import { Timer } from "lucide-vue-next";
  import _ from "lodash";

  const videoList = ref([]);
  const chosenVideo = ref(null);

  const lengthInSeconds = (duration) => {
    convertISO8601ToSeconds(duration);

    if (duration) {
      return `${duration} seconds`;
    } else {
      return `${duration} seconds`;
    }
  };

  function convertISO8601ToSeconds(input) {
    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0,
      minutes = 0,
      seconds = 0,
      totalseconds;

    if (reptms.test(input)) {
      var matches = reptms.exec(input);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      totalseconds = hours * 3600 + minutes * 60 + seconds;
    }

    // a function to convert seconds into minutes and seconds with the format MM::SS
    const d = Number(totalseconds);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var mDisplay = m + ":";
    var sDisplay = s + "s";
    return mDisplay + sDisplay;
  }

  const getLatestVideo = async () => {
    // const runtimeConfig = useRuntimeConfig();
    const API_KEY = "AIzaSyDPwdCSsl2eQdCa-gt7zlkvIaytjiT7Uwk";
    const PLAYLIST_ID = "PLRgiRkSo1Ec3kvDkP1z64FqqttBjjBKC2";
    let videoIdsCommaSeparated = "";

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items.length > 0) {
        const latestVideo = data.items[data.items.length - 1];
        const videoId = latestVideo.snippet.resourceId.videoId;

        const videoIds = data.items.map((item) => item.snippet.resourceId.videoId);
        videoIdsCommaSeparated = videoIds.join(",");
        console.log("Comma-separated video IDs:", videoIdsCommaSeparated);
      }
    } catch (error) {
      console.error("Error fetching the latest video: ", error);
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIdsCommaSeparated}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items.length > 0) {
        videoList.value = data.items;
      }
    } catch (error) {
      console.error("Error fetching the latest video: ", error);
    }
  };

  getLatestVideo();

  const selectedVideos = ref();

  const handleFilter = (selected) => {
    console.log("Selected filter: ", selected);
    selectedVideos.value = selected;
    console.log("New Selected filter: ", selectedVideos.value);
    console.log("filteredProducts", filteredProducts);
  };

  const filteredProducts = computed(() => {
    if (!selectedVideos.value) return videoList.value;
    return videoList.value.filter((video) => video?.snippet?.tags?.includes(selectedVideos.value));
  });

  const uniqueTags = computed(() => {
    const allTags = videoList.value.map((video) => video.snippet.tags);
    const flattenedTags = _.flatten(allTags);
    return _.uniq(flattenedTags);
  });
</script>

<template>
  <div class="flex gap-4">
    <div class="w-2/12 min-w-[300px]">
      <SunshineVideosFilter
        @filter-items="handleFilter"
        :filterOptions="uniqueTags"
      />
    </div>
    <div class="w-10/12">
      <Card>
        <CardContent class="py-6">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">Class videos</h2>
              <p class="text-sm text-muted-foreground">Latest videos uploaded by you</p>
            </div>
          </div>
          <Separator class="my-4" />
          <div class="space-y-6">
            <div
              v-if="filteredProducts.length > 0"
              class="grid grid-cols-2 gap-4"
            >
              <div
                v-for="(video, i) in filteredProducts"
                :key="`video${i}`"
                class="rounded-sm overflow-hidden"
              >
                <Sheet>
                  <div class="relative cursor-pointer mb-2 flex w-full">
                    <SheetTrigger as-child>
                      <div class="rounded-lg overflow-hidden aspect-video mr-3 max-w-[200px]">
                        <img
                          :src="video.snippet.thumbnails.maxres.url"
                          class="h-full object-cover transition-all hover:scale-105"
                        />
                        <Badge
                          class="rounded-sm mt-2 absolute bottom-2 left-2"
                          variant="secondary"
                        >
                          <Timer class="w-4 mr-1" />{{ convertISO8601ToSeconds(video.contentDetails.duration) }}
                        </Badge>
                      </div>
                    </SheetTrigger>
                    <div class="mt-3">
                      <SheetTrigger as-child>
                        <h3 class="text-sm font-medium leading-none tracking-tight max-w-full">
                          {{ video.snippet.title }}
                        </h3>
                      </SheetTrigger>
                      <p class="text-xs font-medium text-muted-foreground mt-1">
                        {{ video.snippet.channelTitle }}
                      </p>
                      <div>
                        <Badge
                          v-for="(tag, i) in video.snippet.tags"
                          :key="`tag${i}`"
                          class="rounded-sm mt-2 mr-1"
                        >
                          {{ tag }}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <SheetContent class="w-[50%] !max-w-full">
                    <div class="">
                      <VideoPlayer
                        :video="`https://www.youtube.com/v/${video.id}`"
                        :start="videoList[i].start"
                        :end="videoList[i].end"
                        :tags="videoList[i].tags"
                        class="mb-6"
                      />
                    </div>
                    <SheetHeader class="mt-4">
                      <SheetTitle class="text-2xl">{{ video?.snippet?.title }}</SheetTitle>
                      <SheetDescription v-if="video?.snippet?.description">
                        {{ video?.snippet?.description }}
                      </SheetDescription>
                    </SheetHeader>
                    <div class="px-0">
                      <h3 class="font-semibold leading-none tracking-tight mt-4">Tags:</h3>
                      <ul class="flex flex-wrap mt-4">
                        <li
                          v-for="(tag, i) in video?.snippet?.tags"
                          :key="`tag${i}`"
                          class="mr-2 mb-2"
                        >
                          <Badge
                            variant="secondary"
                            class="rounded-md"
                          >
                            {{ tag }}
                          </Badge>
                        </li>
                      </ul>
                    </div>

                    <SheetFooter>
                      <SheetClose as-child>
                        <Button type="submit"> Close </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            <p v-else>No videos found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
