<template>
  <div class="w-full">
    <div class="flex flex-col sm:flex-row max-w-screen-lg justify-start items-start">
      <div class="w-full sm:w-4/12 sm:mr-6">
        <PlaylistMusicPlayer
          :currentTrack="currentTrack"
          :trackImage="props.trackImage"
          ref="myChild"
          class="order-first top-0 sm:top-10"
        />

        <div v-if="selectedTrackArtistId">
          <DJRecommendations
            :artistId="selectedTrackArtistId"
            :trackId="selectedTrackId"
            :filteredItems="filteredItems"
            @change-track="changeTrack"
          />
        </div>
      </div>
      <div class="flex bg-white shadow-md rounded-lg overflow-hidden sm:w-6/12">
        <div class="flex flex-col w-full start">
          <div class="flex flex-col px-5 py-3">
            <div class="border-b pb-1 flex justify-between items-center mb-2">
              <span class="text-base font-semibold text-gray-700"> Playlist</span>
              <img
                class="w-4 cursor-pointer"
                src="https://p.kindpng.com/picc/s/152-1529312_filter-ios-filter-icon-png-transparent-png.png"
              />
            </div>

            <div
              v-for="(track, index) in props.tracks"
              :key="`item${index}`"
            >
              <div>
                <PlaylistTrack
                  @click="testCall(track.track || track, track?.track?.album?.images[0].url || props.trackImage)"
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
  const nuxtApp = useNuxtApp();
  const getRecommendations = nuxtApp.getRecommendations;

  const selectedTrackId = ref();
  const selectedTrackArtistId = ref();
  const recommendations = ref();

  const refreshNewTrack = (e, trackImage) => {
    selectedTrackId.value = e.id;
    selectedTrackArtistId.value = e.artists[0].id;
    myChild.value.changeTrack(e, trackImage);
  };

  const refreshRecommendations = async () => {
    recommendations.value = await getRecommendations(selectedTrackArtistId.value, selectedTrackId.value, 20);
  };

  const testCall = (e, trackImage) => {
    console.log("testCall", e, trackImage);
    refreshNewTrack(e, trackImage);
    refreshRecommendations();
  };

  const changeTrack = (e, trackImage) => {
    refreshNewTrack(e, trackImage);
  };

  const filteredItems = computed(() => recommendations?.value?.tracks.filter((track) => track.preview_url));
</script>

<style scoped>
  .sticky-div {
    position: sticky;
  }
</style>
