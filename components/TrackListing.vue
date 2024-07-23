<template>
  <!-- component -->
  <!-- This is an example component -->
  <div class="w-full">
    <div class="flex bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex flex-col w-full">
        <div class="flex flex-col px-5 py-3">
          <!-- <div class="border-b pb-1 flex justify-between items-center mb-2">
            <span class="text-base font-semibold uppercase text-gray-700">
              play list</span
            >
            <img
              class="w-4 cursor-pointer"
              src="https://p.kindpng.com/picc/s/152-1529312_filter-ios-filter-icon-png-transparent-png.png"
            />
          </div> -->

          <div v-for="(track, index) in props.tracks" :key="`item${index}`">
            <div
              v-if="track.track.preview_url"
              class="flex items-center border-b py-3 cursor-pointer hover:shadow-md px-2"
            >
              <img
                class="w-20 h-20 object-cover rounded-lg mr-2"
                alt="User avatar"
                :src="track.track.album?.images[0]?.url"
              />
              <div class="flex flex-col px-2 w-full">
                <span
                  class="text-sm text-red-500 capitalize font-semibold pt-1"
                >
                  {{ track.track.name }}
                </span>
                <span class="text-xs text-gray-500 uppercase font-medium">
                  {{
                    track?.track.artists.map((artist) => artist.name).join(", ")
                  }}
                </span>
              </div>
              <MusicPlayerNew :trackPreviewUrl="track.track.preview_url" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tracks: Object,
});
</script>
