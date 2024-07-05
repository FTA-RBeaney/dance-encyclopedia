<template>
  <div class="h-full px-4 py-6 lg:px-8">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Classic Strolls</h2>
        <p class="text-sm text-muted-foreground">
          Videos of the classic strolls
        </p>
      </div>
    </div>

    <Separator class="my-4" />
    <div class="relative">
      <ScrollArea class="w-[100%]">
        <div class="flex space-x-4 pb-4 w-max">
          <CloudVideo
            v-for="media in videoList"
            :key="media.id"
            :media="media"
            class="w-[250px]"
          />

          <!-- <AlbumArtwork
            v-for="album in listenNowAlbums"
            :key="album.name"
            :album="album"
            class="w-[250px]"
            aspect-ratio="portrait"
            :width="250"
            :height="330"
          /> -->
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
    <div class="flex items-center justify-between mt-4">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Movie clips</h2>
        <p class="text-sm text-muted-foreground">Lindy hop in movie scenes</p>
      </div>
    </div>
    <Separator class="my-4" />
    <div class="relative">
      <ScrollArea class="w-[100%]">
        <div class="flex space-x-4 pb-4">
          <AlbumArtwork
            v-for="album in madeForYouAlbums"
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

const videoList = [
  {
    id: 1,
    name: "The Big Apple",
    artist: "Leonard Reed and Willie Bryant",
    publicId:
      "https://res.cloudinary.com/dgbn0ttzf/video/upload/so_10p,du_5/v1720205005/The_Big_Apple___Keep_Punching_1939_in_full_color___Colorized_with_DeOldify_tzaxla.mp4",
    link: "https://www.youtube.com/watch?v=H1K5M5xluZs",
  },
  {
    id: 2,
    name: "The Shim Sham",
    artist: "Frankie Manning",
    publicId:
      "https://res.cloudinary.com/dgbn0ttzf/video/upload/so_10p,du_5/v1720207965/shim_sham_yhmrnc.mp4",
    link: "https://www.youtube.com/watch?v=bjfM4Wrj9UI",
  },
  {
    id: 3,
    name: "The Tranky Doo",
    artist: "Frankie Manning",
    publicId:
      "https://res.cloudinary.com/dgbn0ttzf/video/upload/so_10p,du_5/v1720216322/Tranky_Doo_-_Harlem_Hot_Shots_bl5sth.mp4",
    link: "https://www.youtube.com/watch?v=QnD8V6-uzbM",
  },
  {
    id: 4,
    name: "Mama's Stew",
    artist: "George Sullivan",
    publicId:
      "https://res.cloudinary.com/dgbn0ttzf/video/upload/so_10p,du_5/v1720216672/Spontaneous_Mama_Stew_-_Empire_swing_s9mwe6.mp4",
    link: "https://www.youtube.com/watch?v=T8ChDfbgP18",
  },
  {
    id: 5,
    name: "The Trickeration",
    artist: "Norma Miller",
    publicId:
      "https://res.cloudinary.com/dgbn0ttzf/video/upload/so_10p,du_5/v1720218179/The_Global_Trickeration_Project_ywtbhh.mp4",
    link: "https://www.youtube.com/watch?v=obCMq4OuM-s&t=8s",
  },
];
</script>
