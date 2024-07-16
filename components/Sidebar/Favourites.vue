<template>
  <div class="py-2">
    <h2 class="relative px-7 text-lg font-semibold tracking-tight">
      Favourites
    </h2>
    <ScrollArea v-if="inputLength > 0" class="h-[300px] px-1">
      <div class="space-y-1 p-2">
        <SideBarFavourite
          v-for="(favourite, i) in favourites"
          :favourite="favourite"
          :key="`${favourite}-${i}`"
        >
        </SideBarFavourite>
      </div>
    </ScrollArea>
    <p v-else class="h-[300px] px-7 py-2">No favourites!</p>
  </div>
</template>

<script setup>
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();
import { RealtimeChannel } from "@supabase/supabase-js";
let realtimeChannel = RealtimeChannel;
const favourites = ref([]);
const getUserInfo = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", supabaseUser.value.id);

    user.value = data;
    if (error) throw error;
  } catch (error) {
    console.log("error: ", error);
  }
};

const getFavourites = async () => {
  // check favourites table
  const { data } = await supabase
    .from("favourites")
    .select("*")
    .eq("user_id", supabaseUser.value.id);

  favourites.value = data;
};
const channel = supabase
  .channel("public:favourites")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "favourites",
    },

    (payload) => getFavourites()
  )
  .subscribe();
const inputLength = computed(() => favourites.value.length);

onMounted(() => {
  getFavourites();
});

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>
