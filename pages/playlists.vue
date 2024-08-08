<script setup>
import { playlists } from "~/data/playlists";
</script>

<template>
  <div class="px-3 py-2" v-if="playlists?.length > 0">
    <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Playlists</h2>

    <div class="w-full flex flex-wrap">
      <PlaylistCard
        :playlistId="playlist?.id"
        v-for="(playlist, index) in playlists"
        :key="`playlist-${index}`"
      />
    </div>
  </div>
</template>
