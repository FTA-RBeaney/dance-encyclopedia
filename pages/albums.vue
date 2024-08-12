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
    .from("albums")
    .select(`*,profiles(*)`)
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
  </div>
</template>
