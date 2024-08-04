<template>
  <div>
    <div class="col-span-3">
      <div class="h-full py-6">
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
                  <!-- <NuxtLink
                    :to="`/video/${album.name}`"
                    class="relative block w-60 h-96 space-y-3"
                    v-for="album in videoList"
                    :key="album.name"
                  >
                    <ArtistAlbumArtwork
                      :album="album"
                      class="w-[250px]"
                      aspect-ratio="portrait"
                      :width="250"
                    />
                  </NuxtLink> -->
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
            <VideosUserVideos />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { videoList, otherVideos } from "../data/videos";
</script>

<style scoped>
[data-media-player][data-layout="video"],
:where(.vds-poster) {
  background: none;
}
</style>
