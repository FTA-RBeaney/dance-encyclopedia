<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

const isFavourite = ref(false);
const isLoaded = ref(false);
const spotifyLink = ref();
const spotInfoHtml = ref();

const artistId = route.params.slug;

const artistUrl = `https://musicbrainz.org/ws/2/artist/${artistId}?inc=url-rels&fmt=json`;

const { data: artistData } = await useFetch(artistUrl);

const { $script } = useScriptNpm({
  packageName: "js-confetti",
  file: "dist/js-confetti.browser.js",
  version: "0.12.0",
  scriptOptions: {
    // tell useScript how to resolve the third-party script
    use() {
      return { JSConfetti: window.JSConfetti };
    },
  },
});

// get the musician name and change it to a format that we can use in Wikipedia's rest API
const artistName = artistData.value.name;
const key = artistName.trim().replace(/'/g, "%27").replace(/ /g, "_");
var wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
const { data: wikiInfo } = await useFetch(wikiUrl);

// check favourites table to see if current page is a favourite
const { data, error } = await supabase
  .from("favourites")
  .select("favourite_id")
  .eq("favourite_id", user.value.id + route.params.slug);

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
        name: artistName,
      })
      .select();

    const confetti = new JSConfetti();
    confetti.addConfetti({ emojis: ["🎉", "❤️", "🎉", "✨"] });

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

// get spotify embed link
const filteredItems = artistData.value.relations.filter((item) => {
  if (item.url.resource.includes("spotify")) {
    return item.url.resource.includes("spotify");
  }
});

if (filteredItems[0]) {
  spotifyLink.value =
    "https://open.spotify.com/oembed?url=" + filteredItems[0].url.resource;
  const { data: spotInfo } = await useFetch(spotifyLink.value);
  spotInfoHtml.value = spotInfo.value.html;
}

// change loaded state on mount
onMounted(async () => {
  return (isLoaded.value = true);
});
</script>

<template>
  <div class="w-full h-full">
    <div>
      <div class="flex justify-between items-center">
        <Heading
          :title="artistData?.name"
          :description="wikiInfo.description"
        />
        <div class="px-4 py-4">
          <FavouriteButton
            v-if="isFavourite"
            @click="removeFavourite(artistId)"
            extraClasses="bg-[#EF4444] hover:bg-[#EF4444]/90 focus:ring-[#EF4444]/50"
            >Favourited! <IconsHeartFull class="ml-2"
          /></FavouriteButton>
          <FavouriteButton v-else @click="addFavourite(artistId)"
            >Favourite <IconsHeartOutline class="ml-2"
          /></FavouriteButton>
        </div>
      </div>

      <div
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden mt-6"
      >
        <section class="text-gray-600 body-font">
          <div class="container flex flex-col">
            <div class="lg:w-5/6">
              <ArtistDetail :musician="artistData" :wikiInfo="wikiInfo" />
            </div>
          </div>
        </section>
      </div>
      <div
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden mt-6"
      >
        <ArtistImageList :artistName="artistName" />
      </div>
      <div
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden mt-6"
      >
        <ArtistAlbumList :artistId="artistId" />
      </div>
      <div class="bottom-drawer">
        <div class="h-2 bg-red-light"></div>
        <div class="inline-flex items-center justify-center bg-red-lightest">
          <div class="shadow-lg rounded-lg">
            <div v-html="spotInfoHtml"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
a:hover {
  cursor: pointer;
}
.bottom-drawer iframe {
  height: 82px;
  width: 300px;
}
.bottom-drawer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: auto;
  height: auto;
}
</style>
