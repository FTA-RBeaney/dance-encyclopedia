<template>
  <div>
    <div class="col-span-3">
      <div class="h-full px-4 py-6">
        <Tabs default-value="music" class="h-full space-y-6">
          <div class="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="music" class="relative">
                Classic videos
              </TabsTrigger>
              <TabsTrigger value="podcasts"> User videos </TabsTrigger>
            </TabsList>
            <div class="ml-auto mr-4">
              <AddVideo />
            </div>
          </div>
          <TabsContent value="music" class="border-none p-0 outline-none">
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h2 class="text-2xl font-semibold tracking-tight">
                  Classic Strolls
                </h2>
                <p class="text-sm text-muted-foreground">
                  Videos of the classic strolls
                </p>
              </div>
            </div>

            <Separator class="my-4" />
            <div class="relative">
              <ScrollArea class="w-[100%]">
                <div class="flex space-x-4 pb-4 w-max">
                  <HoverVideo
                    v-for="media in videoList"
                    :key="media.id"
                    :media="media"
                    class="w-[250px]"
                  />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div class="flex items-center justify-between mt-4">
              <div class="space-y-1">
                <h2 class="text-2xl font-semibold tracking-tight">
                  Movie clips
                </h2>
                <p class="text-sm text-muted-foreground">
                  Lindy hop in movie scenes
                </p>
              </div>
            </div>
            <Separator class="my-4" />
            <div class="relative">
              <ScrollArea class="w-[100%]">
                <div class="flex space-x-4 pb-4">
                  <ArtistAlbumArtwork
                    v-for="album in otherVideos"
                    :key="album.name"
                    :album="album"
                    class="w-[250px]"
                    aspect-ratio="portrait"
                    :width="250"
                    :height="330"
                  />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="podcasts">
            <div v-if="userVideos.length > 0">
              <div class="flex items-center justify-between mt-4">
                <div class="space-y-1">
                  <h2 class="text-2xl font-semibold tracking-tight">
                    User added videos
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    A selection of user favourites!
                  </p>
                </div>
              </div>
              <Separator class="my-4" />
              <div class="relative">
                <div
                  v-if="userVideoData"
                  class="grid grid-cols-2 md:grid-cols-2 gap-4"
                >
                  <div
                    v-for="(video, i) in userVideoData"
                    :key="`video${i}`"
                    class="rounded-sm overflow-hidden"
                  >
                    <a
                      :href="`https://www.youtube.com/watch?v=${video.id}`"
                      target="_blank"
                      class="relative group block"
                    >
                      <NuxtImg
                        :src="video.snippet.thumbnails.maxres.url"
                        class="h-auto max-w-full w-full object-cover transition-all hover:scale-105"
                      />

                      <div
                        class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 bottom-0 h-full flex justify-center items-center text-sm bg-black bg-opacity-50 p-2 text-center text-white"
                      >
                        {{ video.snippet.title }}
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>No user videos added!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();
import { videoList, otherVideos } from "../data/videos";

const userVideos = ref();
const userVideoData = ref([]);

const getVideos = async () => {
  const { data: videos } = await supabase.from("videos").select();
  userVideos.value = videos;
};

const fetchVideoData = async () => {
  for (const item in userVideos.value) {
    var videoURL = userVideos.value[item].url;
    let regex =
      /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    var videoId = regex.exec(videoURL)[3];

    console.log("videoId", videoId);

    const videoArray = await getVideoDetails(videoId);

    userVideoData.value.push(videoArray.items[0]);
    console.log("userVideoData", videoArray.items[0]);
  }
};

async function myAsyncFunction() {
  try {
    await getVideos();
    await fetchVideoData();
  } catch (error) {
    console.log(error);
  }
}

myAsyncFunction();
</script>
