<script setup>
import { Play, Headphones } from "lucide-vue-next";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

const supabase = useSupabaseClient();

const props = defineProps({
  featuredArtist: Object,
  artist: Object,
});

const artistData = ref();

const { data: featuredArtist, refresh: featuredRefresh } = await useAsyncData(
  "featuredCardArtist",
  async () => {
    const { data, error } = await supabase
      .from("musicians")
      .select("*")
      .eq("id", "54799c0e-eb45-4eea-996d-c4d71a63c499")
      .limit(1)
      .single();

    return data;
  }
);

let spotifyId = featuredArtist.value.spotify_id;

const { data } = await useAsyncData("featuredCardMusicians", async () => {
  const { data, error } = await supabase
    .from("musicians")
    .select("*")
    .eq("id", props.artist.post_id)
    .limit(1)
    .single();

  return data;
});

const nuxtApp = useNuxtApp();
const getArtistInfo = nuxtApp.getArtistInfo;
const getArtistAlbums = nuxtApp.getArtistAlbums;

const responseData = ref();
const albumData = ref();

console.log("spotifyId", data);

const { data: response } = await useAsyncData(
  "featuredCardArtistInfo",
  async () => {
    const data = await getArtistInfo(spotifyId);

    return data;
  }
);

const { data: albums } = await useAsyncData(
  "featuredCardSpotifyInfo",
  async () => {
    const data = await getArtistAlbums(spotifyId);

    return data;
  }
);

console.log("albums", albums);
</script>
<template>
  <Carousel
    class="h-[464px]"
    :plugins="[
      Autoplay({
        delay: 5000,
      }),
      Fade(),
    ]"
  >
    <CarouselContent class="h-full">
      <CarouselItem class="h-[464px]">
        <Card
          class="flex items-center bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100 relative overflow-hidden h-full bg-no-repeat bg-black"
          :style="{
            backgroundImage: `url('${featuredArtist.featured_image}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }"
        >
          <div
            class="px-9 py-8 flex flex-col justify-between pl-[4.5rem] z-10 relative"
          >
            <div class="mb-20 pt-12">
              <span class="font-bold text-white fs-4 mb-2 block lh-0"
                >Featured Artist:</span
              >
              <h3 class="font-bold text-white text-6xl mb-3 ms-n1">
                {{ featuredArtist.name }}
              </h3>

              <span class="font-bold text-white fs-4 mb-8 block lh-0">{{
                featuredArtist?.wiki_data.description
              }}</span>

              <div class="flex items-center">
                <div class="flex items-center me-6">
                  <a href="#" class="me-2">
                    <Play class="w-3 h-3 text-white" />
                  </a>

                  <span class="fw-semibold text-white fs-6"
                    >Popularity: {{ response?.popularity }}/100</span
                  >
                </div>

                <div class="flex items-center">
                  <a href="#" class="me-2">
                    <Headphones class="w-3 h-3 text-white" />
                  </a>

                  <span class="fw-semibold text-white fs-6"
                    >{{ albums?.total }} albums</span
                  >
                </div>
              </div>
            </div>

            <div class="mb-10">
              <NuxtLink :to="`/artist/${featuredArtist.name}`">
                <Button class="me-2 p-6"> Listen Now </Button>
              </NuxtLink>
              <Button
                variant="secondary"
                href="/metronic8/demo55/apps/support-center/overview.html"
                class="p-6"
              >
                Save for Later
              </Button>
            </div>
          </div>
          <div
            class="absolute left-0 top-0 bg-black opacity-50 w-full h-full z-0"
          ></div>
        </Card>
      </CarouselItem>
    </CarouselContent>
  </Carousel>
</template>
