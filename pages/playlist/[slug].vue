<template>
  <section id="profile">
    <div>
      <Heading
        v-if="response?.name"
        :title="response.name"
        description="A playlist"
      />
      <div
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden"
      >
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
                {{
                  item?.track?.artists.map((artist) => artist.name).join(", ")
                }}
              </TableCell>
              <TableCell>
                <!-- <a
                v-if="item.track?.external_urls?.spotify"
                :href="item.track?.external_urls?.spotify"
                target="_blank"
                class="text-white w-48 bg-green-500 hover:bg-green-500/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mt-2 justify-center"
              >
                Listen on Spotify
             
              </a> -->
                <a
                  v-if="item.track?.external_urls?.spotify"
                  :href="item.track?.external_urls?.spotify"
                  target="_blank"
                  class="inline-flex justify-center items-center px-8 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200"
                  >Listen <IconsSpotify
                /></a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <!-- <pre>{{ response }}</pre> -->
    </div>
  </section>
</template>

<script setup>
// tracks.items[0].track.preview_url = preview clip
const nuxtApp = useNuxtApp();
const route = useRoute();

const getNowPlaying = nuxtApp.getNowPlaying;
const playlistId = route.params.slug;
const response = ref();

const res = await getNowPlaying(playlistId);
response.value = res;
</script>
