<script setup>
import { useMediaControls } from "@vueuse/core";

const props = defineProps({
  song: Object,
  trackPreviewUrl: String,
});
const { song } = props;

const video = ref();
const { playing, currentTime, duration, volume } = useMediaControls(video, {
  src: props.trackPreviewUrl,
});

const toMMSS = (numSecs) => {
  let secNum = parseInt(numSecs, 10);
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - hours * 3600) / 60);

  let seconds = secNum - hours * 3600 - minutes * 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// Change initial media properties
onMounted(() => {
  volume.value = 0.5;
  currentTime.value = 0;
});
</script>

<template>
  <div class="flex items-center space-x-3 p-2">
    <audio hidden controls ref="video" id="playerid"></audio>

    <button
      class="rounded-full w-10 h-10 flex items-center justify-center pl-0.5 ring-1 ring-red-400 focus:outline-none"
      @click="playing = !playing"
    >
      <svg
        v-if="!playing"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ef4444"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        v-else
        class="text-red-500 hover:text-red-500 cursor-pointer w-6 h-6"
      >
        <path
          d="M15 7C15 6.44772 15.4477 6 16 6C16.5523 6 17 6.44772 17 7V17C17 17.5523 16.5523 18 16 18C15.4477 18 15 17.5523 15 17V7ZM7 7C7 6.44772 7.44772 6 8 6C8.55228 6 9 6.44772 9 7V17C9 17.5523 8.55228 18 8 18C7.44772 18 7 17.5523 7 17V7Z"
        ></path>
      </svg>
    </button>
    <div class="flex justify-end w-full sm:w-auto pt-1 sm:pt-0">
      <div class="flex text-xs text-gray-700 uppercase font-medium pl-2">
        <span>{{ toMMSS(currentTime) }}</span
        >/<span>{{ toMMSS(duration) }}</span>
      </div>
    </div>
  </div>
</template>
