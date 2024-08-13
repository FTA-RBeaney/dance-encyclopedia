<template>
  <div
    class="p-2 rounded-xl hover:bg-emphasis transition-colors cursor-pointer"
  >
    <div class="relative w-full aspect-[195/118.5] rounded-lg overflow-hidden">
      <NuxtLink :to="`/video/${props?.media?.name}`" class="relative block">
        <video
          v-if="props.media.publicId"
          class="absolute w-[110%] max-w-[110%] object-cover"
          height="100%"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          loop
          muted
        >
          <source :src="media?.publicId" type="video/mp4" />
        </video>
        <div v-else class="overflow-hidden rounded-md">
          <img
            :src="props.media.cover"
            :alt="props.media.name"
            class="h-full object-cover max-w-[110%]"
          />
        </div>
      </NuxtLink>
      <div
        class="absolute z-10 top-2 right-2 px-2 py-1 text-sm font-medium leading-tight bg-secondary dark:bg-surface-950 border border-surface rounded-md"
      >
        4.8
      </div>
      <div class="absolute z-10 bottom-2 inset-x-2">
        <div
          role="progressbar"
          class="p-progressbar p-component p-progressbar-determinate !h-1.5 !bg-surface-950 dark:!bg-surface-50 !rounded-full"
          aria-valuemin="0"
          aria-valuenow="45"
          aria-valuemax="100"
          data-pc-name="progressbar"
          data-pc-section="root"
          pc1824=""
        >
          <div
            class="p-progressbar-value !bg-surface-0 dark:!bg-surface-950 !rounded-full"
            data-pc-section="value"
            style="width: 45%; display: flex"
          ></div>
        </div>
      </div>
    </div>
    <div class="mt-2 flex items-start justify-between gap-1">
      <div class="px-2 flex-1">
        <div class="font-medium text-color leading-6 line-clamp-1">
          {{ props?.media?.name }}
        </div>
        <div class="mt-1 text-muted-color text-sm leading-5">
          {{ props?.media?.artist }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  media: Object,
  isLoaded: Boolean,
});

const isLoaded = ref(false);

onMounted(() => {
  isLoaded.value = true;
});

const handleMouseEnter = (e) => {
  const vid = e.target;
  vid.muted = true;
  vid.play();
};

const handleMouseLeave = (e) => {
  const vid = e.target;
  vid.muted = true;
  vid.currentTime = 0;
  vid.pause();
};
</script>

<style>
.video-container > div {
  /* width: 250px; */
  border-radius: calc(var(--radius) - 2px);
}
.video-preview video {
  object-fit: cover;
  left: 0;
  top: 0;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

div.vjs-poster {
  background-size: cover;
}
</style>
