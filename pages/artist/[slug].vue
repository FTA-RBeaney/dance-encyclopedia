<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();
const supabase = useSupabaseClient();
const route = useRoute();

const { data: musician } = await useAsyncData("musicians", async () => {
  const { data } = await client
    .from("musicians")
    .select("id, name, spotify_embed, wikipedia_link, spotify_link")
    .eq("id", route.params.slug)
    .limit(1)
    .single();

  return data;
});

const key = musician.value.name.trim().replace(/'/g, "%27").replace(/ /g, "_");

var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${key}`;
var relatedUrl = `https://en.wikipedia.org/api/rest_v1/page/related/${key}`;
const { data: count } = await useFetch(url);
const { data: relatedContent } = await useFetch(relatedUrl);

const artistSpotify = ref("");
const isFavourite = ref(false);

// check favourites table
//
const { data, error } = await supabase
  .from("favourites")
  .select("favourite_id")
  .eq("favourite_id", user.value.id + route.params.slug);

console.log(data);

if (data.length > 0) {
  console.log("THIS PAGE IS A FAVOURITE");
  isFavourite.value = true;
}

if (musician.value.spotify_link) {
  let newSubstring = musician.value.spotify_link;
  artistSpotify.value = newSubstring.substring(
    newSubstring.lastIndexOf("/") + 1,
    newSubstring.lastIndexOf("?")
  );
}

const isLoaded = ref(false);
onMounted(async () => {
  return (isLoaded.value = true);
});

async function addFavourite(id) {
  isFavourite.value = true;

  // try {
  //   const user = useSupabaseUser();

  const { data } = await supabase
    .from("favourites")
    .upsert({
      favourite_id: user.value.id + id,
      user_id: user.value.id,
      post_id: id,
    })
    .select();

  //   console.log("INITIAL", data[0]);

  //   if (data[0].favourites.length > 0) {

  //   } else {
  //     return;
  //   }
  //   if (error) throw error;
  // } catch (error) {
  //   alert(error.message);
  // } finally {
  // }
}
</script>

<template>
  <div class="px-4 py-6">
    <Heading :title="musician.name" :description="count.description" />
    <section class="text-gray-600 body-font">
      <div class="container flex flex-col">
        <div class="lg:w-5/6">
          <!-- <div class="rounded-lg h-64 overflow-hidden">
            <img
              alt="content"
              class="object-cover object-center h-full w-full object-left-top"
              :src="count.originalimage.source"
            />
          </div> -->
          <div class="flex flex-col sm:flex-row mt-1">
            <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
              <img
                v-if="count.thumbnail"
                class="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
                :src="count?.thumbnail?.source"
                alt="Rounded avatar"
              />

              <div
                class="flex flex-col items-center text-center justify-center"
              >
                <h2 class="font-medium title-font mt-4 text-gray-900 text-lg">
                  {{ count.title }}
                </h2>
                <div class="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                <p class="text-base">
                  {{ count.description }}
                </p>
                <div class="mt-2 w-full">
                  <a
                    v-if="isFavourite"
                    :data-id="count.id"
                    @click.prevent="addFavourite(musician.id)"
                    class="text-white bg-[#EF4444] hover:bg-[#EF4444]/90 focus:ring-4 focus:outline-none focus:ring-[#EF4444]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2"
                  >
                    <IconsHeartFull />
                  </a>
                  <a
                    v-else
                    :data-id="count.id"
                    @click.prevent="addFavourite(musician.id)"
                    class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2"
                  >
                    <IconsHeartOutline />
                  </a>
                  <a
                    v-if="musician.wikipedia_link"
                    :href="musician.wikipedia_link"
                    target="_blank"
                    class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#ffffff"
                      aria-hidden="true"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="m15.562 19.478-3.07-7.238q-.258.51-1.652 3.182t-2.068 4.057c-.051.006-.11.009-.17.009-.041 0-.082-.002-.122-.005h.005c-.019.001-.04.001-.062.001-.075 0-.15-.006-.222-.018l.008.001q-.854-2.01-2.662-6.114t-2.704-6.209c-.193-.428-.425-.796-.699-1.128l.007.008c-.315-.396-.669-.741-1.063-1.035l-.015-.011c-.287-.248-.653-.411-1.055-.447l-.007-.001q0-.052-.005-.25t-.005-.282h6.073v.521c-.301.018-.582.077-.846.173l.021-.007c-.275.092-.508.246-.692.447l-.001.001c-.104.103-.168.246-.168.403 0 .096.024.187.066.266l-.002-.003q.271.614 2.255 5.2t2.453 5.626q.32-.635 1.458-2.776t1.364-2.578q-.198-.406-1.313-2.926t-1.416-3.073q-.396-.72-2.094-.74v-.523l5.343.01v.49c-.012 0-.026 0-.04 0-.345 0-.667.096-.942.263l.008-.005q-.349.24-.13.72.344.73.906 1.974t.895 1.953q1.146-2.229 1.802-3.781.25-.573-.103-.826c-.34-.178-.742-.282-1.169-.282-.061 0-.121.002-.181.006h.008c.007-.065.011-.14.011-.216 0-.015 0-.03 0-.045v.002-.25q.666 0 1.776-.005l2.834-.015v.51c-.457.016-.882.142-1.253.351l.014-.007c-.382.203-.697.486-.931.828l-.006.009-2.219 4.604q.135.344 1.328 3.021t1.266 2.854l4.594-10.593c-.103-.271-.282-.494-.511-.648l-.005-.003c-.193-.143-.419-.256-.663-.324l-.015-.004c-.17-.043-.369-.071-.572-.08h-.006v-.524l4.792.042.01.021-.01.458c-.965.014-1.782.633-2.089 1.495l-.005.016q-5.482 12.666-5.824 13.447z"
                        ></path>
                      </g>
                    </svg>
                  </a>
                  <!-- Spotify link -->
                  <a
                    v-if="musician.spotify_link"
                    :href="musician.spotify_link"
                    target="_blank"
                    class="text-white bg-[#24292F] bg-green-500 hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2"
                  >
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 20 20"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      fill="#ffffff"
                      stroke="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>spotify [#162]</title>
                        <desc>Created with Sketch.</desc>
                        <defs></defs>
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Dribbble-Light-Preview"
                            transform="translate(-140.000000, -7479.000000)"
                            fill="#ffffff"
                          >
                            <g
                              id="icons"
                              transform="translate(56.000000, 160.000000)"
                            >
                              <path
                                d="M99.915,7327.865 C96.692,7325.951 91.375,7325.775 88.297,7326.709 C87.803,7326.858 87.281,7326.58 87.131,7326.085 C86.981,7325.591 87.26,7325.069 87.754,7324.919 C91.287,7323.846 97.159,7324.053 100.87,7326.256 C101.314,7326.52 101.46,7327.094 101.196,7327.538 C100.934,7327.982 100.358,7328.129 99.915,7327.865 L99.915,7327.865 Z M99.81,7330.7 C99.584,7331.067 99.104,7331.182 98.737,7330.957 C96.05,7329.305 91.952,7328.827 88.773,7329.792 C88.36,7329.916 87.925,7329.684 87.8,7329.272 C87.676,7328.86 87.908,7328.425 88.32,7328.3 C91.951,7327.198 96.466,7327.732 99.553,7329.629 C99.92,7329.854 100.035,7330.334 99.81,7330.7 L99.81,7330.7 Z M98.586,7333.423 C98.406,7333.717 98.023,7333.81 97.729,7333.63 C95.381,7332.195 92.425,7331.871 88.944,7332.666 C88.609,7332.743 88.274,7332.533 88.198,7332.197 C88.121,7331.862 88.33,7331.528 88.667,7331.451 C92.476,7330.58 95.743,7330.955 98.379,7332.566 C98.673,7332.746 98.766,7333.129 98.586,7333.423 L98.586,7333.423 Z M94,7319 C88.477,7319 84,7323.477 84,7329 C84,7334.523 88.477,7339 94,7339 C99.523,7339 104,7334.523 104,7329 C104,7323.478 99.523,7319.001 94,7319.001 L94,7319 Z"
                                id="spotify-[#162]"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div
              class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left"
            >
              <p class="leading-relaxed text-lg mb-4">
                {{ count.extract }}
              </p>
              <a
                class="text-indigo-500 inline-flex items-center"
                :href="count.content_urls.desktop.page"
                >Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>

              <div v-if="musician.spotify_link">
                <iframe
                  class="mt-4"
                  v-if="isLoaded"
                  style="border-radius: 12px"
                  :src="`https://open.spotify.com/embed/artist/${artistSpotify}?utm_source=generator&theme=0`"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>

                <div
                  v-else
                  role="status"
                  class="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                >
                  <div
                    class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700"
                  >
                    <svg
                      class="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path
                        d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
                      />
                    </svg>
                  </div>
                  <div class="w-full">
                    <div
                      class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
                    ></div>
                    <div
                      class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"
                    ></div>
                    <div
                      class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"
                    ></div>
                    <div
                      class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"
                    ></div>
                    <div
                      class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"
                    ></div>
                    <div
                      class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"
                    ></div>
                  </div>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <!-- related articles -->
              <!-- 
              <div class="flex justify-between pb-4 mt-4">
                <p class="font-bold text-xl">Related</p>
              </div>
              <ul class="flex flex-col pl-1">
                <li
                  class="border-b py-2 dark:border-gray-600"
                  v-for="related in relatedContent.pages"
                  :key="related"
                >
                  <a
                    class="dark:text-gray-300"
                    v-html="related.displaytitle"
                    :href="related.content_urls.desktop.page"
                  ></a>
                </li>
              </ul> -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
