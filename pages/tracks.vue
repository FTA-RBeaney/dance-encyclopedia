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
    .select(`*,profiles(*)`)
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

console.log("musicList", musicList.value.value);

const currentTrack = ref(musicList.value.value[0].spotify_info);
const myChild = ref(null);

function testCall(e) {
  myChild.value.changeTrack(e);
}
</script>

<template>
  <div class="">
    <LoadingCircle
      v-if="isLoading"
      class="fixed left-0 top-0 bg-black/30 w-screen h-screen z-20 flex justify-center items-center"
    />
    <AddAlbum />

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
      class="order-first h-auto fixed bottom-5 w-5/12 max-w-[450px] right-8 border mx-auto"
      variant="dj"
    />

    <!-- 
    <MusicPlayer
      :currentTrack="currentTrack"
      :trackImage="props.trackImage"
      ref="myChild"
      class="order-first w-full sm:w-6/12 top-0 sm:top-10 sm:mr-6"
    /> -->
  </div>
</template>
