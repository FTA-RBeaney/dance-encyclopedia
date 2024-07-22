<template>
  <div>
    <div class="flex items-end justify-between">
      <Heading v-if="response?.name" :title="response.name" />
    </div>
    <a
      v-if="response?.external_urls?.spotify"
      :href="response?.external_urls?.spotify"
      target="_blank"
      class="inline-flex justify-center items-center text-xs px-8 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 mb-4"
      >Listen on Spotify <IconsSpotify
    /></a>
    <!-- <pre>
      {{ response }}
    </pre> -->
    <MusicPlayer
      v-for="(song, index) in response.tracks.items"
      :key="`item${index}`"
      url="https://p.scdn.co/mp3-preview/8b2afa48db299909e222eef85ccc680daf7d4285?cid=13bb1428eae64e859182a5744c991e93"
      playerid="audio-player"
      :song="song"
    />
    <section id="playlist">
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
                <audio controls>
                  <source :src="item.track.preview_url" type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
                <!-- <a
                  v-if="item.track?.external_urls?.spotify"
                  :href="item.track?.external_urls?.spotify"
                  target="_blank"
                  class="inline-flex justify-center items-center text-xs px-4 py-3 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200"
                  >Listen <IconsSpotify
                /></a> -->
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  </div>
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
