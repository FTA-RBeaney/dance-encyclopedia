<template>
  <div
    class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative"
  >
    <div class="absolute top-1 right-1">
      <FavouriteButton
        v-if="isFavourite"
        @click="removeFavourite(artistId)"
        extraClasses="bg-[#EF4444] hover:bg-[#EF4444]/90 focus:ring-[#EF4444]/50"
        ><IconsHeartFull
      /></FavouriteButton>
      <FavouriteButton v-else @click="addFavourite(artistId)"
        ><IconsHeartOutline
      /></FavouriteButton>
    </div>
    <NuxtLink :to="`/artist/${artistId}`">
      <img
        class="w-full card-image"
        :src="wikiInfo?.thumbnail?.source"
        alt=""
      />
    </NuxtLink>
    <div class="py-2 px-3">
      <a href="#">
        <h5
          class="text-md font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ artistData.name }}
        </h5>
      </a>
      <!-- <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {{ artistData.country }}
        {{ artistData["life-span"].begin }}
        {{ artistData["life-span"].end }}
      </p>
      <NuxtLink :to="`/artist/${artistId}`">
        <a
          href="#"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg
            class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </NuxtLink> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  artistId: String,
});

const artistFetchUrl = `https://musicbrainz.org/ws/2/artist/${props.artistId}?&fmt=json`;
const { data: artistData } = await useFetch(artistFetchUrl);

console.log(artistData);
const key = artistData.value.name
  .trim()
  .replace(/'/g, "%27")
  .replace(/ /g, "_");
var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
const { data: wikiInfo } = await useFetch(url);

const isFavourite = ref(false);
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();
// check favourites table to see if current page is a favourite
const { data, error } = await supabase
  .from("favourites")
  .select("favourite_id")
  .eq("favourite_id", user.value.id + props.artistId);
console.log(data);

if (data.length > 0) {
  isFavourite.value = true;
}

// add favourite functionality
async function addFavourite(id) {
  isFavourite.value = true;

  try {
    const { data } = await supabase
      .from("favourites")
      .upsert({
        favourite_id: user.value.id + id,
        user_id: user.value.id,
        post_id: id,
      })
      .select();

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
}

//remove favourite
async function removeFavourite(id) {
  isFavourite.value = false;

  try {
    const { data } = await supabase
      .from("favourites")
      .delete()
      .eq("favourite_id", user.value.id + id);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
}
</script>

<style scoped lang="scss">
.card-image {
  width: 200px;
  height: 100%;
  max-height: 160px;
  object-fit: cover;

  @media (width >= 600px) {
    max-height: 160px;
  }
}
</style>
