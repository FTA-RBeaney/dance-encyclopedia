<script setup lang="ts">
import "vidstack/player/styles/default/theme.css";
import "vidstack/player/styles/default/layouts/video.css";

import "vidstack/player";
import "vidstack/player/layouts/default";
import "vidstack/player/ui";

const props = defineProps({
  video: String,
  poster: String,
});
</script>

<template>
  <ClientOnly>
    <media-player
      stream-type="on-demand"
      :src="video"
      keep-alive
      playsinline
      style="width: 100%; height: 100%"
    >
      <media-provider playsinline>
        <media-poster
          class="vds-poster"
          :src="poster"
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
</template>

<style>
iframe.vds-youtube[data-no-controls] {
  height: 100% !important;
}
</style>
