<script setup lang="ts">
import "vidstack/player/styles/default/theme.css";
import "vidstack/player/styles/default/layouts/video.css";

import "vidstack/player";
import "vidstack/player/layouts/default";
import "vidstack/player/ui";

const props = defineProps({
  video: Object,
});
</script>

<template>
  <div
    class="max-w-100 mx-auto bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden p-4 mt-4"
  >
    <ClientOnly>
      <media-player
        stream-type="on-demand"
        :src="video.fullVideo"
        keep-alive
        playsinline
        style="width: 100%; height: 100%"
      >
        <media-provider playsinline>
          <media-poster
            class="vds-poster"
            :src="video.cover"
            alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
          />
        </media-provider>
        <media-video-layout></media-video-layout>
        <media-controls>
          <media-controls-group></media-controls-group>
          <media-controls-group></media-controls-group>
        </media-controls>
      </media-player>
    </ClientOnly>
  </div>
</template>

<style>
iframe.vds-youtube[data-no-controls] {
  height: 100% !important;
}
</style>
