<script setup>
import "vidstack/player/styles/default/theme.css";
import "vidstack/player/styles/default/layouts/video.css";

import "vidstack/player";
import "vidstack/player/layouts/default";
import "vidstack/player/ui";

const props = defineProps({
  video: String,
  poster: String,
  start: String,
  end: String,
  tags: Array,
});
</script>

<template>
  <ClientOnly>
    <media-player
      :src="video"
      keep-alive
      playsinline
      style="width: 100%; height: 100%"
      autoplay
      :clipStartTime="start"
      :clipEndTime="end"
    >
      <media-provider playsinline> </media-provider>
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
  height: 200% !important;
}
</style>
