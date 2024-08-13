<template>
  <Card>
    <CardContent class="py-6">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold tracking-tight">Recent videos</h2>
          <p class="text-sm text-muted-foreground">
            Latest videos uploaded by users
          </p>
        </div>
        <div class="ml-auto mr-4">
          <AddVideo />
        </div>
      </div>

      <Separator class="my-4" />
      <VideosUserVideosH />
      <!-- <div class="relative">
      <ScrollArea class="w-[100%]">
        <div class="flex space-x-4 pb-4 w-max">
          <VideosCard
            v-for="media in videoList"
            :key="media.id"
            :media="media"
            class="min-w-[20%]"
          /> -->

      <!-- <HoverVideo
                    v-for="media in videoList"
                    :key="media.id"
                    :media="media"
                    class="w-[250px]"
                  /> -->
      <!-- </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div> -->

      <!-- Tabs -->
      <div class="col-span-3">
        <div class="h-full py-6">
          <Tabs default-value="music" class="h-full space-y-6">
            <div class="space-between flex items-center">
              <TabsList>
                <TabsTrigger value="music" class="relative">
                  Classic videos
                </TabsTrigger>
                <TabsTrigger value="strolls"> Strolls </TabsTrigger>
                <!-- <TabsTrigger value="podcasts"> User videos </TabsTrigger> -->
              </TabsList>
            </div>

            <TabsContent value="music" class="border-none p-0 outline-none">
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
                <div class="grid grid-cols-4 pb-4">
                  <VideosCard
                    v-for="media in otherVideos"
                    :key="media.name"
                    :media="media"
                    class=""
                  />
                  <!-- <ArtistAlbumArtwork 
                    v-for="album in otherVideos"
                    :key="album.name"
                    :album="album"
                    class="w-[250px]"
                    aspect-ratio="portrait"
                    :width="250"
                    :height="330"
                  /> -->
                </div>
              </div>
            </TabsContent>
            <TabsContent value="strolls" class="border-none p-0 outline-none">
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
                <div class="grid grid-cols-4 pb-4">
                  <VideosCard
                    v-for="media in videoList"
                    :key="media.id"
                    :media="media"
                  />
                </div>
              </div>
            </TabsContent>
            <!-- <TabsContent value="podcasts">
            <VideosUserVideos />
          </TabsContent> -->
          </Tabs>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { videoList, otherVideos } from "../data/videos";
const posts = ref([]);

onMounted(async () => {
  try {
    const accessToken =
      "IGQWROWjFWelRqVzZAkbjlyQkw4VWtZAQVFhOTQ5dmE0cnlNWGFLeEh5SG00S1hkQkxRY19TWnpkSFVjQ1JOdHJ2b2lBQXZAscGlINWNzczFYQ1JzWjBCTEtHd3FCUU5nM2JQV0pNWWFFQmJ2Mk1xSjNkU2tDR1NOQzgZD";
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink&access_token=${accessToken}`
    );
    const data = await response.json();
    posts.value = data.data;
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
  }
});
</script>

<style scoped>
[data-media-player][data-layout="video"],
:where(.vds-poster) {
  background: none;
}
</style>
