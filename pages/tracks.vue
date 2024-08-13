<script setup>
import { columns } from "../components/DJ/columns";
const supabase = useSupabaseClient();
let channel;
const isLoading = ref(false);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const { data, refresh } = await useAsyncData("albums", async () => {
  isLoading.value = true;
  await delay(1000);

  const { data } = await supabase
    .from("tracks")
    .select(`*,profiles(*),albums(*)`)
    .neq("type", "album")
    .order("created_at", { ascending: false });

  await delay(1000);
  isLoading.value = false;

  return data;
});

const musicList = computed(() => data);

onMounted(() => {
  channel = supabase
    .channel("public:albums")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "albums",
      },

      () => refresh()
    )
    .subscribe();

  isLoading.value = false;
});

onUnmounted(() => {
  supabase.removeChannel(channel);
});

// const trackImage = computed(
//   () => musicList.value.value.albums.spotify_info.images[0].url
// );

const currentTrack = ref(musicList?.value?.value[0].spotify_info);
const currentImage = ref(
  musicList?.value?.value[0].albums.spotify_info.images[0].url
);
const myChild = ref(null);

const spotifyId = ref("0Ek1ETnfVq8J6s8pQQxVju");

const { data: spotInfo } = await useFetch(
  `https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F${spotifyId.value}`
);

const testCall = async (e) => {
  myChild.value.changeTrack(e);
};
</script>

<template>
  <div class="pb-40">
    <LoadingCircle
      v-if="isLoading"
      class="fixed left-0 top-0 bg-black/30 w-screen h-screen z-20 flex justify-center items-center"
    />
    <!-- <AddAlbum /> -->

    <AddSong />

    <Card class="p-6 mt-6">
      <DJDataTable
        :data="musicList.value"
        :columns="columns"
        @test-call="testCall"
      />
    </Card>

    <PlaylistMusicPlayer
      :currentTrack="currentTrack"
      ref="myChild"
      class="order-first h-auto fixed bottom-5 w-6/12 max-w-[550px] min-w-[550px] right-8 mx-auto"
      variant="dj"
      :trackImage="currentImage"
    />
  </div>
</template>
