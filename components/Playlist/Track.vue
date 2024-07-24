<template>
  <div>
    <img
      class="w-10 h-10 object-cover rounded-lg mr-2"
      alt="User avatar"
      :src="track.track.album?.images[0]?.url"
    />
    <div class="flex flex-col px-2 w-full">
      <span class="text-sm text-red-500 capitalize font-semibold pt-1">
        {{ track.track.name }}
      </span>
      <span class="text-xs text-gray-500 uppercase font-medium">
        {{ track?.track.artists.map((artist) => artist.name).join(", ") }}
      </span>
    </div>
    <div class="px-4 py-4">
      <FavouriteButton
        v-if="isFavourite"
        @click="removeFavourite(track.track)"
        extraClasses="bg-[#EF4444] hover:bg-[#EF4444]/90 focus:ring-[#EF4444]/50"
        ><IconsHeartFull
      /></FavouriteButton>
      <FavouriteButton v-else @click="addFavourite(track.track)"
        ><IconsHeartOutline
      /></FavouriteButton>
    </div>
  </div>
</template>

<script setup>
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();
const props = defineProps({
  trackId: String,
  track: Object,
});

const isFavourite = ref();
// check favourites table to see if current page is a favourite
if (supabaseUser.value) {
  const { data, error } = await supabase
    .from("favourites")
    .select("favourite_id")
    .eq("favourite_id", supabaseUser.value.id + props.trackId);

  if (data.length > 0) {
    isFavourite.value = true;
  }
}

// add favourite functionality
async function addFavourite(track) {
  isFavourite.value = true;

  try {
    const { data, error } = await supabase
      .from("favourites")
      .upsert({
        favourite_id: supabaseUser.value.id + track.id,
        user_id: supabaseUser.value.id,
        post_id: track.id,
        name: track.name,
        type: "song",
      })
      .select();

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
}

//remove favourite
async function removeFavourite(track) {
  isFavourite.value = false;

  try {
    const { data } = await supabase
      .from("favourites")
      .delete()
      .eq("favourite_id", supabaseUser.value.id + track.id);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
}
</script>
