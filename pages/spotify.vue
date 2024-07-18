<template>
  <section id="profile">
    <div class="px-4 py-6 mx-auto">
      <Heading
        v-if="response?.name"
        :title="response.name"
        description="A playlist"
      />

      <NuxtLink :to="response?.tracks?.next">Next</NuxtLink>
      <Table v-if="response?.tracks?.items">
        <TableHeader>
          <TableRow>
            <TableHead class="font-bold"> Album </TableHead>
            <TableHead class="font-bold"> Song </TableHead>
            <TableHead class="font-bold"> Artists </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(item, index) in response.tracks.items"
            :key="`item${index}`"
          >
            <TableCell>
              <NuxtImg
                v-if="item?.track?.album?.images"
                class="aspect-square object-cover"
                :src="item?.track?.album?.images[0]?.url"
                format="webp"
                width="60"
                height="60"
                preload
                loading="lazy"
                placeholder="https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png"
                @error="
                  $event.target.src =
                    'https://archive.org/download/placeholder-image/placeholder-image.jpg'
                "
                alt=""
              />
            </TableCell>
            <TableCell class="font-medium">
              {{ item.track.name }}
            </TableCell>
            <TableCell>
              <span
                v-for="(artist, index) in item?.track?.artists"
                :key="`artist-${index}`"
                >{{ artist.name }}</span
              >
            </TableCell>
            <TableCell>
              <a
                v-if="item.track?.external_urls?.spotify"
                :href="item.track?.external_urls?.spotify"
                target="_blank"
                class="text-white w-60 bg-green-500 hover:bg-green-500/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mt-2 justify-center"
              >
                Listen on Spotify
                <IconsSpotify />
              </a>

              <!-- response.tracks.items[0].track.artists[]  -->
              <!-- response.tracks.items[0].track.external_urls.spotify  -->
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <pre>{{ response }}</pre>
    </div>
  </section>
</template>

<script setup>
// tracks.items[0].track.preview_url = preview clip
const nuxtApp = useNuxtApp();
const getNowPlaying = nuxtApp.getNowPlaying;
console.log("getNowPlaying");

const currentTrackStr = ref("nope");
const response = ref();
const currentTrack = async () => {
  try {
    response.value = await getNowPlaying();

    console.log("yay", response.value);
  } catch (e) {
    currentTrackStr.value = "Couldn't fetch data :(";
  }
};

onBeforeMount(async () => {
  currentTrack();
});

// const { data } = await useFetch(`https://api.spotify.com/v1/playlists`, {
//         method: 'GET',
//         watch: false,
//         headers: {
//             authorization: `Bearer ${authToken.value}`,
//         },
//         params: params,
//         onResponse({response}) {
//             busStops.value = [];
//             // @ts-ignore
//             busStops.value = response._data.data;
//             isLoading.value = true;
//         },
//     });
</script>
