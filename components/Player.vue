<script setup lang="ts">
import "vidstack/player/styles/default/theme.css";
import "vidstack/player/styles/default/layouts/video.css";

import "vidstack/player";
import "vidstack/player/layouts/default";
import "vidstack/player/ui";

const props = defineProps({
  video: String,
});
</script>

<template>
  <div
    class="max-w-100 mx-auto bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden p-4 mt-4"
  >
    <ClientOnly>
      <media-player
        stream-type="on-demand"
        :src="video"
        keep-alive
        playsinline
        style="width: 100%; height: 100%"
      >
        <media-provider playsinline></media-provider>
        <media-video-layout></media-video-layout>
      </media-player>
    </ClientOnly>
  </div>
</template>
