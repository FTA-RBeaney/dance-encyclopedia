<script setup>
import { useMediaControls } from "@vueuse/core";

const props = defineProps({
  song: Object,
});
const { song } = props;

const video = ref();
const { playing, currentTime, duration, volume } = useMediaControls(video, {
  src: song?.track?.preview_url,
});

// Change initial media properties
onMounted(() => {
  volume.value = 0.5;
  currentTime.value = 0;
});
</script>

<template>
  <div v-if="!song.track.preview_url"></div>
  <div class="mb-4" v-else>
    <audio hidden controls ref="video" id="playerid"></audio>
    <div class="w-full">
      <div class="flex w-8/12 bg-white shadow-md rounded-lg overflow-hidden">
        <div class="flex flex-col w-full">
          <div class="flex p-5 border-b">
            <img
              class="w-20 h-20 object-cover"
              alt="User avatar"
              :src="song?.track?.album?.images[0]?.url"
            />
            <div class="flex flex-col px-2 w-full">
              <span class="text-xs text-gray-700 uppercase font-medium">
                {{
                  song?.track?.artists.map((artist) => artist.name).join(", ")
                }}
              </span>
              <span class="text-sm text-red-500 capitalize font-semibold pt-1">
                {{ song.track.name }}
              </span>
              <span class="text-xs text-gray-500 uppercase font-medium">
                {{ song.track.album.name }}
              </span>
              <div class="flex justify-end">
                <img
                  class="w-5 cursor-pointer"
                  src="https://www.iconpacks.net/icons/2/free-favourite-icon-2765-thumb.png"
                />
                <img
                  class="w-5 cursor-pointer mx-2"
                  src="https://www.iconpacks.net/icons/2/free-favourite-icon-2765-thumb.png"
                />
                <img
                  class="w-5 cursor-pointer"
                  src="https://www.iconpacks.net/icons/2/free-favourite-icon-2765-thumb.png"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center p-5">
            <div class="flex items-center">
              <div class="flex space-x-3 p-2">
                <button class="focus:outline-none">
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                    <line x1="5" y1="19" x2="5" y2="5"></line>
                  </svg>
                </button>
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
                <button class="focus:outline-none">
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                    <line x1="19" y1="5" x2="19" y2="19"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="relative w-full sm:w-1/2 md:w-7/12 lg:w-4/6 ml-2">
              <div class="bg-red-300 h-2 w-full rounded-lg">
                <input
                  v-model="currentTime"
                  type="range"
                  min="0"
                  :max="duration"
                  class="bg-red-500 h-2 w-full rounded-lg overflow-hidden absolute top-0"
                  id="position"
                  name="position"
                />
              </div>
            </div>
            <div class="flex justify-end w-full sm:w-auto pt-1 sm:pt-0">
              <div
                class="flex text-xs text-gray-700 uppercase font-medium pl-2"
              >
                <span>0:{{ Math.round(currentTime) }}</span
                >/<span>0:{{ Math.round(duration) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
