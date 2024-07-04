<template>
  <div class="h-full px-4 py-6 lg:px-8">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Watch Now</h2>
        <p class="text-sm text-muted-foreground">
          Top picks for you. Updated daily.
        </p>
      </div>
    </div>
    <Separator class="my-4" />
    <div class="relative">
      <ScrollArea>
        <div class="flex space-x-4 pb-4">
          <AlbumArtwork
            v-for="album in listenNowAlbums"
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
  </div>
</template>

<script setup>
import { listenNowAlbums, madeForYouAlbums } from "../data/albums";
import { playlists } from "../data/playlists";
</script>
