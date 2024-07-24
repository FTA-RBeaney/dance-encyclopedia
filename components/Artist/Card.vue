<template>
  <div
    class="max-w-sm bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden"
  >
    <div v-if="supabaseUser" class="absolute top-1 right-1 z-10">
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
    <NuxtLink :to="`/artist/${artistId}`" class="">
      <NuxtImg
        class="w-full card-image aspect-square"
        :src="wikiInfo?.thumbnail?.source"
        format="webp"
        width="300"
        height="300"
        preload
        loading="lazy"
        placeholder="https://res.cloudinary.com/dgbn0ttzf/image/upload/v1721434977/person-placeholder_ztoak6.png"
        @error="
          $event.target.src =
            'https://archive.org/download/placeholder-image/placeholder-image.jpg'
        "
        alt=""
      />
    </NuxtLink>
    <div class="py-2 px-3">
      <a href="#">
        <h5
          v-if="wikiInfo"
          class="text-md font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ wikiInfo.titles.normalized }}
        </h5>
      </a>
      <!-- <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {{ wikiInfo }} 
         {{ artistData["life-span"].begin }}
        {{ artistData["life-span"].end }}
      </p> -->
      <!-- <NuxtLink :to="`/artist/${artistId}`">
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
import { cn } from "@/lib/utils";
const img = useImage();
const props = defineProps({
  artistId: String,
  musician: Object,
});

const key = props.musician.name.trim().replace(/'/g, "%27").replace(/ /g, "_");
var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
const { data: wikiInfo } = await useFetch(url);

const isFavourite = ref(false);
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

// check favourites table to see if current page is a favourite
if (supabaseUser.value) {
  const { data, error } = await supabase
    .from("favourites")
    .select("favourite_id")
    .eq("favourite_id", supabaseUser.value.id + props.artistId);

  if (data.length > 0) {
    isFavourite.value = true;
  }
}

// add favourite functionality
async function addFavourite(id) {
  isFavourite.value = true;

  try {
    const { data, error } = await supabase
      .from("favourites")
      .upsert({
        favourite_id: supabaseUser.value.id + id,
        user_id: supabaseUser.value.id,
        post_id: id,
        name: wikiInfo.value.titles.normalized,
        type: "artist",
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
      .eq("favourite_id", supabaseUser.value.id + id);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
}
</script>

<style scoped lang="scss">
.card-image {
  // width: 200px;
  height: 100%;
  // max-height: 160px;
  // min-height: 160px;
  object-fit: cover;

  @media (width >= 600px) {
    // max-height: 160px;
    // min-height: 160px;
  }
}
</style>
