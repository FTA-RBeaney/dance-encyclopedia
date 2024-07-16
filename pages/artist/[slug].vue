<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

const isFavourite = ref(false);
const isLoaded = ref(false);
const spotifyLink = ref();
const spotInfoHtml = ref();

const artistId = route.params.slug;

const megaList = `https://musicbrainz.org/ws/2/artist/${artistId}?inc=release-groups%2Burl-rels&fmt=json`;
const { data: everything } = await useFetch(megaList);

// get the musician name and change it to a format that we can use in Wikipedia's rest API
const artistName = everything.value.name;
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

// change loaded state on mount
onMounted(async () => {
  return (isLoaded.value = true);
});

const filteredItems = everything.value.relations.filter((item) => {
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

var mediaUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${key}`;
const { data: wikiMedia } = await useFetch(mediaUrl);
</script>

<template>
  <div class="w-full h-full">
    <LoadingCircle v-if="!isLoaded" />
    <div v-else class="px-4 py-6">
      <div class="flex justify-between items-center">
        <Heading
          :title="everything?.name"
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

      <section class="text-gray-600 body-font">
        <div class="container flex flex-col">
          <div class="lg:w-5/6">
            <ArtistDetail :musician="everything" :wikiInfo="wikiInfo" />
          </div>
        </div>
      </section>

      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold tracking-tight">Images</h2>
          <p class="text-sm text-muted-foreground">Various images</p>
        </div>
      </div>
      <Separator class="my-4" />
      <ScrollArea class="w-[100%] whitespace-nowrap mb-4">
        <div class="flex space-x-4 pb-4">
          <figure
            v-for="(media, index) in wikiMedia.items"
            :key="index"
            className="shrink-0"
          >
            <div class="overflow-hidden rounded-md">
              <img
                v-if="media.srcset"
                :src="media.srcset[0].src"
                class="aspect-square h-36 w-fit object-cover"
              />
            </div>
          </figure>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold tracking-tight">Albums</h2>
          <p class="text-sm text-muted-foreground">A list of all the albums</p>
        </div>
      </div>
      <Separator class="my-4" />
      <ArtistAlbumList :everything="everything" />

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
iframe {
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
