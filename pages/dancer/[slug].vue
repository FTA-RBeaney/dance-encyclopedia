<template>
  <div class="flex">
    <!-- left column -->
    <div class="w-5/12">
      <div
        class="relative h-44 bg-white rounded-lg shadow-lg overflow-hidde mb-14"
      >
        <div class="absolute inset-0 rounded-lg overflow-hidden bg-red-200">
          <img
            :src="dancer[0].image"
            :alt="dancer[0].name"
            class="object-cover w-full h-full"
          />
          <div
            class="absolute inset-0 backdrop backdrop-blur-10 bg-gradient-to-b from-transparent to-black"
          ></div>
        </div>
        <div
          class="absolute flex space-x-6 transform translate-x-6 translate-y-8"
        >
          <div class="w-44 h-44 rounded-lg shadow-lg overflow-hidden">
            <img
              :src="dancer[0].image"
              :alt="dancer[0].name"
              class="object-cover h-full w-full"
            />
          </div>
          <div class="text-white pt-12">
            <h3 class="font-bold">{{ dancer[0].name }}</h3>
            <span v-if="dancer[0].birth_year" class="text-sm opacity-60 mr-1">
              <span v-if="dancer[0].birth_year">
                {{ createDate(dancer[0].birth_year) }}</span
              >
              <span v-if="dancer[0].death_year">
                - {{ createDate(dancer[0].death_year) }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <Card class="p-4">
        <div class="px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ dancer[0].name }}
              </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Born</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ createFullDate(dancer[0].birth_year) }}
              </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Died</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ createFullDate(dancer[0].death_year) }}
              </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Credits:</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul
                  class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400"
                >
                  <li>Hellzapoppin'</li>
                  <li>The Big Apple</li>
                  <li>The Shim Sham</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
    <!-- <Heading :title="dancer[0].name" /> -->

    <!-- right column -->
    <div class="w-7/12 body-font ml-4">
      <ClientOnly>
        <Editor :dancerId="dancer[0].id" />
      </ClientOnly>
      <!-- <div
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden"
      >
        <div class="">
          <div class="flex flex-col sm:flex-row mt-1">
            <div class="sm:w-1/3 text-center sm:pr-8">
              <div class="overflow-hidden rounded-md">
                <img
                  v-if="wikiMedia?.original"
                  :src="wikiMedia?.original?.source"
                  :alt="wikiMedia.title"
                  width="300px"
                  height="300px"
                  class="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                />
                <img
                  v-else
                  :src="dancer[0].image"
                  :alt="dancer[0].name"
                  width="150px"
                  height="150px"
                  class="h-auto w-full md:w-auto object-cover transition-all hover:scale-105 aspect-square"
                />
              </div>
            </div>
            <div
              class="sm:w-2/3 sm:pl-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4sm:mt-0 text-center sm:text-left"
            >
              Artist details here
            </div>
          </div>
        </div>
      </div> -->

      <!-- <Card class="p-4">
        <p v-if="dancer[0].blurb" class="leading-relaxed text-lg">
          {{ dancer[0].blurb }}
        </p>
        <div
          v-if="wikiMedia"
          v-html="wikiMedia.extract"
          class="leading-relaxed text-md mb-4 extract prose"
        ></div>
      </Card> -->

      <Card
        v-if="dancerPlaylistId"
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden mt-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-xl font-bold leading-none text-gray-900 dark:text-white"
          >
            Videos
          </h3>
          <a
            :href="`https://www.youtube.com/playlist?list=${dancerPlaylistId}`"
            target="_blank"
            class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            View all
          </a>
        </div>
        <div class="flow-root">
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              v-for="(video, index) in videoArray.items"
              :key="`video${index}`"
              class="py-3 sm:py-4 transition-all hover:scale-105"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img
                    class="w-16 aspect-ratio[4/3] rounded-sm"
                    :src="video.snippet.thumbnails.high.url"
                    alt="Neil image"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 truncate dark:text-white"
                  >
                    <a
                      :href="`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`"
                      target="_blank"
                    >
                      {{ video.snippet.title }}
                    </a>
                  </p>
                  <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    <a
                      :href="`https://www.youtube.com/channel/${video.snippet.videoOwnerChannelId}`"
                      target="_blank"
                    >
                      {{ video.snippet.videoOwnerChannelTitle }}
                    </a>
                  </p>
                </div>
                <!-- <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  $320
                </div> -->
              </div>
            </li>
          </ul>
        </div>
      </Card>

      <CommentsList />
    </div>
    <!-- <pre>
        {{ videoArray.items }}
    </pre> -->
  </div>
</template>

<script setup>
const route = useRoute();
const client = useSupabaseClient();
const dancerName = route.params.slug;
const { data: dancer } = await client
  .from("dancers")
  .select("*")
  .eq("name", dancerName);

const dancerPlaylistId = dancer[0].playlist_id;
const videoArray = await getDancerPlaylist(dancerPlaylistId);

const isLoaded = ref(false);

var mediaUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&formatversion=2&format=json&titles=${dancerName}&prop=extracts|pageimages&piprop=original`;

const response = ref();
const wikiMedia = ref();

var options = { year: "numeric", timeZone: "GMT" };
var optionsFull = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "GMT",
};

const createDate = (createdAt) =>
  new Date(createdAt).toLocaleDateString("en-UK", options);

const createFullDate = (createdAt) =>
  new Date(createdAt).toLocaleDateString("en-UK", optionsFull);

const { data, error } = useFetch(mediaUrl, {
  onResponse({ response }) {
    isLoaded.value = true;
    wikiMedia.value = response._data.query.pages[0];
  },
});

if (response.value) {
  dancer.value = response;
}

// change loaded state on mount
onMounted(async () => {
  return (isLoaded.value = true);
});
</script>

<style lang="scss">
.extract {
  p {
    margin-bottom: 1.4rem;
    &.mw-empty-elt {
      display: none;
    }
  }

  ul {
    list-style: disc;
    margin-left: 2rem;
    margin-bottom: 2rem;
  }
}
</style>
