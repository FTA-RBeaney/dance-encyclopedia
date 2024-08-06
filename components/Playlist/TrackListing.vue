<template>
  <div class="w-full">
    <div
      class="flex flex-col sm:flex-row max-w-screen-lg justify-center items-start"
    >
      <PlaylistMusicPlayer
        :currentTrack="currentTrack"
        :trackImage="props.trackImage"
        ref="myChild"
        class="order-first w-full sm:w-6/12 top-0 sm:top-10 sm:mr-6"
      />
      <div class="flex bg-white shadow-md rounded-lg overflow-hidden sm:w-6/12">
        <div class="flex flex-col w-full start">
          <div class="flex flex-col px-5 py-3">
            <div class="border-b pb-1 flex justify-between items-center mb-2">
              <span class="text-base font-semibold text-gray-700">
                Playlist</span
              >
              <img
                class="w-4 cursor-pointer"
                src="https://p.kindpng.com/picc/s/152-1529312_filter-ios-filter-icon-png-transparent-png.png"
              />
            </div>

            <div v-for="(track, index) in props.tracks" :key="`item${index}`">
              <div>
                <PlaylistTrack
                  v-if="track?.track?.preview_url || track.preview_url"
                  @click="testCall(track)"
                  :trackId="track?.track?.id || track.id"
                  :track="track"
                  :trackImage="props.trackImage"
                  class="flex items-center border-b py-3 cursor-pointer hover:shadow-md px-2"
                />
              </div>
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
  trackImage: String,
});

const currentTrack = ref(props.tracks[0]);
const myChild = ref(null);

function testCall(e) {
  myChild.value.changeTrack(e);
}
</script>

<style scoped>
.sticky-div {
  position: sticky;
}
</style>
