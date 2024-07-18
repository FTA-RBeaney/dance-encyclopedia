<template>
  <div class="px-4 py-6">
    <Heading :title="dancer[0].name" />

    <section class="text-gray-600 body-font">
      <div class="container flex flex-col">
        <div class="">
          <div class="flex flex-col sm:flex-row mt-1">
            <div class="sm:w-1/3 text-center sm:pr-8">
              <div class="overflow-hidden rounded-md">
                <img
                  :src="dancer[0].image"
                  :alt="dancer[0].name"
                  width="150px"
                  height="150px"
                  class="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                />
              </div>
            </div>
            <div
              class="sm:w-2/3 sm:pl-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4sm:mt-0 text-center sm:text-left"
            >
              <p class="leading-relaxed text-lg mb-4">
                {{ dancer[0].blurb }}
              </p>
            </div>
          </div>
          <div v-if="dancerPlaylistId" class="mx-auto mt-10">
            <div
              class="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700"
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
                <ul
                  role="list"
                  class="divide-y divide-gray-200 dark:divide-gray-700"
                >
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
                        <p
                          class="text-sm text-gray-500 truncate dark:text-gray-400"
                        >
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
            </div>
          </div>
        </div>
      </div>
    </section>
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
</script>
