<script setup>
import { columns } from "../components/Musicians/columns.ts";
import { RealtimeChannel } from "@supabase/supabase-js";

let realtimeChannel = RealtimeChannel;

const supabase = useSupabaseClient();

const allTheMusic = ref();
const isToggled = ref(false);

const { data: topArtists, refresh: topRefresh } = await useAsyncData(
  "topMusicians",
  async () => {
    const { data, error } = await supabase
      .from("favourites")
      .select("*")
      .eq("type", "artist")
      .order("name", { ascending: false })
      .limit(4);

    return data;
  }
);

const toggleListView = () => {
  isToggled.value = !isToggled.value;
};

const channel = supabase
  .channel("public:musicians")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "musicians",
    },

    () => refresh()
  )
  .subscribe();

// search functionality
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const results = ref([]);
const searching = ref(false);

const noResults = computed(
  () => results?.value?.length === 0 || results.value === null
);

const search = async (searchString = "") => {
  searching.value = true;
  // await delay(1000);
  const res = await supabase
    .from("musicians")
    .select()
    .textSearch("name", `${searchString}:*`);
  results.value = res.data;
  searching.value = false;
};

const { data: musicians } = await useAsyncData(
  "cardListMusicians",
  async () => {
    const { data, error } = await supabase
      .from("musicians")
      .select()
      .order("name", { ascending: true });
    return data;
  }
);

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>

<template>
  <div class="w-full h-full">
    <div>
      <Heading title="Artists" />

      <div class="lg:flex justify-between g-5 gx-xl-10 mb-5 mb-xl-10 mt-4">
        <div class="lg:w-8/12 2xl:w-9/12">
          <ArtistFeaturedCard />
        </div>

        <div class="hidden lg:block lg:w-4/12 2xl:w-3/12 min-w-sm lg:ml-6">
          <!-- <Card class="card card-flush h-xl-100" id="kt_player_widget_2">
            <div class="card-header bg-black">
              <h3 class="card-title fw-bold text-white">Player</h3>
              <div class="card-toolbar">
                <button
                  class="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                  data-kt-menu-overflow="true"
                >
                  <i class="ki-outline ki-dots-square fs-1 text-white"></i>
                </button>

                <div
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px"
                  data-kt-menu="true"
                >
                  <div class="menu-item px-3">
                    <div
                      class="menu-content fs-6 text-gray-900 fw-bold px-3 py-4"
                    >
                      Quick Actions
                    </div>
                  </div>

                  <div class="separator mb-3 opacity-75"></div>

                  <div class="menu-item px-3">
                    <a href="#" class="menu-link px-3"> New Ticket </a>
                  </div>

                  <div class="menu-item px-3">
                    <a href="#" class="menu-link px-3"> New Customer </a>
                  </div>

                  <div
                    class="menu-item px-3"
                    data-kt-menu-trigger="hover"
                    data-kt-menu-placement="right-start"
                  >
                    <a href="#" class="menu-link px-3">
                      <span class="menu-title">New Group</span>
                      <span class="menu-arrow"></span>
                    </a>

                    <div class="menu-sub menu-sub-dropdown w-175px py-4">
                      <div class="menu-item px-3">
                        <a href="#" class="menu-link px-3"> Admin Group </a>
                      </div>

                      <div class="menu-item px-3">
                        <a href="#" class="menu-link px-3"> Staff Group </a>
                      </div>

                      <div class="menu-item px-3">
                        <a href="#" class="menu-link px-3"> Member Group </a>
                      </div>
                    </div>
                  </div>
                  <div class="menu-item px-3">
                    <a href="#" class="menu-link px-3"> New Contact </a>
                  </div>
                  <div class="separator mt-3 opacity-75"></div>
                  <div class="menu-item px-3">
                    <div class="menu-content px-3 py-3">
                      <a class="btn btn-primary btn-sm px-4" href="#">
                        Generate Reports
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-body bg-black pt-0">
              <div
                class="mx-auto mb-6 bgi-no-repeat bgi-size-contain bgi-position-center rounded-circle w-125px h-125px"
                style="
                  background-image: url('/metronic8/demo55/assets/media/stock/600x600/img-59.jpg');
                "
              ></div>

              <div class="text-center mb-5">
                <h1 class="text-white fw-bold">Strange Friends</h1>

                <span class="text-white opacity-75 fw-semibold"
                  >Theresa Webb</span
                >
              </div>
            </div>

            <div class="card-footer bg-primary p-0 pb-9">
              <div
                class="mt-n10"
                data-np-autofill-form-type="other"
                data-np-checked="1"
                data-np-watching="1"
              >
                <div class="mb-5">
                  <div class="d-flex flex-stack px-4 text-white opacity-75">
                    <span class="current-time" data-kt-element="current-time"
                      >0:00</span
                    >
                    <span class="duration" data-kt-element="duration"
                      >5:53</span
                    >
                  </div>

                  <input
                    type="range"
                    class="form-range"
                    data-kt-element="progress"
                    min="0"
                    max="100"
                    value="0"
                    step="0.01"
                    data-np-intersection-state="visible"
                  />
                </div>
 
                <div class="d-flex flex-center">
                  <button
                    class="btn btn-icon mx-1"
                    data-kt-element="replay-button"
                  >
                    <i class="bi bi-arrow-repeat fs-2 text-white"></i>
                  </button>

                  <button
                    class="btn btn-icon mx-1"
                    data-kt-element="play-prev-button"
                  >
                    <i class="bi bi-caret-left-fill fs-2 text-white"></i>
                  </button>

                  <button
                    class="btn btn-icon mx-6 play-pause"
                    data-kt-element="play-button"
                  >
                    <i
                      class="bi bi-play-fill text-white fs-4x"
                      data-kt-element="play-icon"
                    ></i>

                    <i
                      class="bi bi-pause-fill text-white fs-4x d-none"
                      data-kt-element="pause-icon"
                    ></i>
                  </button>

                  <button
                    class="btn btn-icon mx-1 next"
                    data-kt-element="play-next-button"
                  >
                    <i class="bi bi-caret-right-fill fs-2 text-white"></i>
                  </button>

                  <button
                    class="btn btn-icon mx-1"
                    data-kt-element="shuffle-button"
                  >
                    <i class="bi bi-shuffle fs-2 text-white"></i>
                  </button>
                </div>
 
                <audio data-kt-element="audio-track-1">
                  <source
                    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
                    type="audio/mpeg"
                  />
                </audio>
              </div>
            </div>
          </Card> -->
          <Card class="">
            <CardHeader
              ><CardTitle>Top artists</CardTitle>
              <CardDescription>As voted for by you</CardDescription></CardHeader
            >
            <CardContent>
              <MusiciansTopRow
                v-for="(artist, i) in topArtists"
                :key="`artist${i}`"
                :artist="artist"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div class="flex w-full justify-between align-center mt-6 mb-6">
        <div class="flex w-full justify-between">
          <MusiciansAddMusician />

          <Search @search="search" class="w-96" />

          <div>
            <MusiciansToggleList
              v-if="noResults"
              @toggle-list-view="toggleListView"
              :isToggled="isToggled"
            />
          </div>
        </div>
      </div>
      <div class="w-full">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>All artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="noResults && !isToggled">
                <ArtistCardList />
              </div>

              <MusiciansDataTable
                :columns="columns"
                :data="results"
                class="mt-4"
                v-if="!noResults"
              />

              <MusiciansDataTable
                :columns="columns"
                :data="musicians"
                class="mt-4"
                v-if="isToggled && noResults"
              />

              <!-- <pre>{{ results }}</pre> -->

              <!-- <div v-else>
                <ArtistCardList :musicians="allArtists" />
              </div> -->
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
