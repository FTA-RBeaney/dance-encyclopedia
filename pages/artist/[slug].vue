<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

const isFavourite = ref(false);
const isLoaded = ref(false);
const spotifyLink = ref();
const spotInfoHtml = ref();
let artistUrl = null;

// get artist data from Supabase, starting with the ID
const artistId = route.params.slug;

const { data: artistData, refresh: wikiRefresh } = await useAsyncData(
  "artistData",
  async () => {
    const { data, error } = await supabase
      .from("musicians")
      .select()
      .eq("name", artistId)
      .limit(1)
      .single();

    return data;
  }
);

// then get the musicbrainz data
artistUrl = `https://musicbrainz.org/ws/2/artist/${artistData.value.id}?inc=url-rels&fmt=json`;

const { data: musicbrainzData, refresh: artistRefresh } = await useAsyncData(
  "artist",
  async () => {
    const { data } = await useFetch(artistUrl);
    return data;
  }
);

// get the musician name and change it to a format that we can use in Wikipedia's rest API
const artistName = artistData.name;

// check favourites table to see if current page is a favourite
const { data, refresh } = await useAsyncData("favourites", async () => {
  const { data, error } = await supabase
    .from("favourites")
    .select("favourite_id")
    .eq("favourite_id", user.value.id + route.params.slug);

  return data;
});

if (data?.length > 0) {
  isFavourite.value = true;
}

// confetti!
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
        type: "artist",
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
const filteredItems = musicbrainzData?.relations?.filter((item) => {
  if (item.url.resource.includes("spotify")) {
    return item.url.resource.includes("spotify");
  }
});

var artistSpotifyId;

if (filteredItems) {
  artistSpotifyId = /[^/]*$/.exec(filteredItems[0]?.url?.resource)[0];

  spotifyLink.value =
    "https://open.spotify.com/oembed?url=" + filteredItems[0].url.resource;
  const { data: spotInfo } = await useFetch(spotifyLink.value);
  spotInfoHtml.value = spotInfo.value.html;
}

const nuxtApp = useNuxtApp();
const getArtistInfo = nuxtApp.getArtistInfo;
const response = ref();
const res = await getArtistInfo(artistData.value.spotify_id);
response.value = res;

// change loaded state on mount
onMounted(async () => {
  return (isLoaded.value = true);
});
</script>

<template>
  <div class="w-full h-full">
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/musicians"> Home </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {{ artistId }}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div
        class="relative min-h-60 bg-white rounded-lg shadow-lg overflow-hidde mt-6 mb-14"
      >
        <div class="absolute inset-0 rounded-lg overflow-hidden bg-red-200">
          <img
            :src="response.images[0].url"
            :alt="artistData.name"
            class="object-cover w-full h-full"
          />
          <div
            class="absolute inset-0 backdrop backdrop-blur-10 bg-gradient-to-b from-transparent to-black"
          ></div>
        </div>
        <div
          class="absolute flex space-x-6 transform translate-x-6 translate-y-24"
        >
          <div class="w-44 h-44 rounded-lg shadow-lg overflow-hidden">
            <img
              :src="response.images[0].url"
              :alt="artistData.name"
              class="object-cover h-full w-full"
            />
          </div>
          <div class="text-white pt-12">
            <h3 class="font-bold">{{ artistData.name }}</h3>
            <span class="text-sm opacity-60 mr-1">
              <span> {{ artistData.wiki_data.description }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <!-- <Heading
          :title="artistId"
          :description="artistData.wiki_data.description"
        /> -->

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

      <div class="flex">
        <div class="w-4/12 mr-4">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {{ artistData.wiki_data.extract }}
            </CardContent>
          </Card>
        </div>
        <div class="w-8/12">
          <Card>
            <CardHeader>
              <CardTitle> Images </CardTitle>
              <CardDescription> Various images </CardDescription>
            </CardHeader>
            <CardContent>
              <ArtistImageList :artistName="artistData.name" />
            </CardContent>
            <ArtistMusic :artistSpotifyId="artistData.spotify_id" />
          </Card>
        </div>
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
