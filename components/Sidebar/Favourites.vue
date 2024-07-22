<template>
  <div class="py-2">
    <h2 class="relative px-7 text-lg font-semibold tracking-tight">
      Favourites
    </h2>
    <ScrollArea v-if="inputLength > 0" class="h-[200px] w-[200px] px-1">
      <div class="space-y-1 p-2 max-w-full">
        <SideBarFavourite
          v-for="(favourite, i) in favourites"
          :postId="favourite.post_id"
          :name="favourite.name"
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

const favourites = ref();

const getFavourites = async () => {
  // check favourites table
  const { data } = await supabase
    .from("favourites")
    .select("*")
    .eq("user_id", supabaseUser.value.id);

  favourites.value = data;
};

console.log(favourites);

const favouritesChannel = supabase
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

await getFavourites();
const inputLength = computed(() => favourites.value.length);

onUnmounted(() => {
  supabase.removeChannel(favouritesChannel);
});
</script>
