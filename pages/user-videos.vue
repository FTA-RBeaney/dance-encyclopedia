<script setup>
const supabase = useSupabaseClient();
const userVideos = ref();
const userVideoData = ref([]);
const gatherData = reactive([]);

import { RealtimeChannel } from "@supabase/supabase-js";

let realtimeChannel = RealtimeChannel;

const chosenVideo = ref();
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

//   const changeVideo = (id) => {
//     chosenVideo.value = `http://youtube.googleapis.com/v/${id}?start=15&end=20&version=3`;
//     chosenVideoDetails.value = userVideoData.value.find((video) => video.id === id);
//   };

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

const changeVideo = (id, start, end) => {
  chosenVideo.value = {
    url: id,
    start: start,
    end: end,
  };
};

const allCategories = ["Lindy", "Solo"];
const moveCategories = ["Tuck Turn", "Pass By", "Frankie Sixes", "Charleston"];
const formatCategories = ["Competition", "Performance"];

const lengthInSeconds = (start, end) => {
  if (start && end) {
    return `${end - start} seconds`;
  } else {
    return "Full video";
  }
};
</script>

<template>
  <div class="flex gap-4">
    <div class="w-2/12 min-w-[300px]">
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>Filter videos below</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <form>
              <div class="space-y-6">
                <div class="space-y-2">
                  <div class="mb-4">
                    <label
                      for="radix-2078-form-item"
                      class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                    >
                      Style
                    </label>
                  </div>
                  <div
                    class="flex items-center space-x-2"
                    v-for="(category, index) in allCategories"
                    :key="index"
                  >
                    <Checkbox
                      :id="category"
                      :checked="category == selected"
                      :name="category"
                      @update:checked="selectFilter(category)"
                    />
                    <label
                      :for="category"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >{{ category }}</label
                    >
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="mb-4">
                    <label
                      for="radix-2078-form-item"
                      class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                    >
                      Format
                    </label>
                  </div>
                  <div
                    class="flex items-center space-x-2"
                    v-for="(category, index) in formatCategories"
                    :key="index"
                  >
                    <Checkbox
                      :id="category"
                      :checked="category == selected"
                      :name="category"
                      @update:checked="selectFilter(category)"
                    />
                    <label
                      :for="category"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >{{ category }}</label
                    >
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="mb-4">
                    <label
                      for="radix-2078-form-item"
                      class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                    >
                      Move
                    </label>
                  </div>
                  <div
                    class="flex items-center space-x-2"
                    v-for="(category, index) in moveCategories"
                    :key="index"
                  >
                    <Checkbox
                      :id="category"
                      :checked="category == selected"
                      :name="category"
                      @update:checked="selectFilter(category)"
                    />
                    <label
                      :for="category"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >{{ category }}</label
                    >
                  </div>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter><Button> Reset </Button></CardFooter>
      </Card>
    </div>
    <div class="w-10/12">
      <Card class="w-full">
        <CardContent class="py-6">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">Your videos</h2>
              <p class="text-sm text-muted-foreground">
                Latest videos uploaded by you
              </p>
            </div>
            <div class="ml-auto mr-4">
              <AddVideo />
            </div>
          </div>

          <Separator class="my-4" />
          <!-- <VideosUserVideosH /> -->

          <div class="relative space-y-6">
            <div>
              <VideoPlayer
                v-if="chosenVideo"
                :video="`https://www.youtube.com/v/${chosenVideo.url}`"
                :start="chosenVideo.start"
                :end="chosenVideo.end"
              />
            </div>
            <div v-if="userVideoData.length > 1" class="grid grid-cols-5 gap-4">
              <div
                v-for="(video, i) in userVideoData"
                :key="`video${i}`"
                class="rounded-sm overflow-hidden"
              >
                <Sheet>
                  <div class="relative group cursor-pointer mb-2">
                    <div class="rounded-lg overflow-hidden aspect-video mr-3">
                      <img
                        @click="
                          changeVideo(
                            video.id,
                            userVideos[i].start,
                            userVideos[i].end
                          )
                        "
                        :src="video.snippet.thumbnails.maxres.url"
                        class="h-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <div class="mt-3">
                      <SheetTrigger as-child>
                        <h3
                          class="text-sm font-medium leading-none tracking-tight max-w-full"
                        >
                          {{ video.snippet.title.substring(0, 50) + "…" }}
                        </h3>
                      </SheetTrigger>
                      <p class="text-xs font-medium text-muted-foreground mt-1">
                        {{ video.snippet.channelTitle }}
                      </p>
                      <div>
                        <Badge
                          v-for="(tag, i) in userVideos[i].tags"
                          :key="`tag${i}`"
                          class="rounded-sm mt-2 mr-1"
                        >
                          {{ tag }}
                        </Badge>
                      </div>
                      <Badge class="rounded-sm mt-2" variant="secondary">
                        {{
                          lengthInSeconds(
                            userVideos[i].start,
                            userVideos[i].end
                          )
                        }}
                      </Badge>
                    </div>
                  </div>

                  <SheetContent class="w-[50%] !max-w-full">
                    <SheetHeader>
                      <!-- <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription> Make changes to your profile here. Click save when you're done. </SheetDescription> -->
                    </SheetHeader>
                    <div>
                      <div class="">
                        <VideoPlayer
                          :video="`https://www.youtube.com/v/${video.id}`"
                          :poster="userVideoData?.snippet?.thumbnails.high.url"
                          :start="userVideos[i].start"
                          :end="userVideos[i].end"
                          :tags="userVideos[i].tags"
                          class="mb-6"
                        />
                      </div>
                      <div class="px-6">
                        <h3
                          class="font-semibold text-xl leading-none tracking-tight mt-2 mb-4"
                        >
                          {{ video?.snippet?.title }}
                        </h3>

                        <p class="text-sm text-muted-foreground my-2">
                          {{ video?.snippet?.description }}
                        </p>
                        <h3
                          class="font-semibold leading-none tracking-tight mt-6"
                        >
                          Tags:
                        </h3>
                        <ul class="flex flex-wrap mt-6">
                          <li
                            v-for="(tag, i) in video?.snippet?.tags"
                            :key="`tag${i}`"
                            class="mr-2 mb-2"
                          >
                            <Badge variant="secondary" class="rounded-md">
                              {{ tag }}
                            </Badge>
                          </li>
                        </ul>
                      </div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
[data-media-player][data-layout="video"],
:where(.vds-poster) {
  background: none;
}
</style>
