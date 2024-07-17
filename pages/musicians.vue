<script setup>
const isLoaded = ref(false);
const isToggled = ref(false);

const supabase = useSupabaseClient();
const allTheMusic = ref([]);

// get musicians
const getMusicians = async () => {
  const { data, error } = await supabase
    .from("musicians")
    .select("*")
    .order("name", { ascending: true });

  allTheMusic.value = data;
};

// const allTheMusic = await useArtists();

const toggleListView = () => {
  isToggled.value = !isToggled.value;
};

import { RealtimeChannel } from "@supabase/supabase-js";
let realtimeChannel = RealtimeChannel;
const channel = supabase
  .channel("public:musicians")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "musicians",
    },

    (payload) => getMusicians()
  )
  .subscribe();

// search functionality
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const results = ref([]);
const searching = ref(false);

const noResults = computed(
  () => results?.value?.length === 0 || results.value === null
);

console.log("results", results.value.length);

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

onUnmounted(() => {
  supabase.removeChannel(channel);
});

// change loaded state on mount
onMounted(async () => {
  getMusicians();
  return (isLoaded.value = true);
});
</script>

<template>
  <div class="w-full h-full">
    <LoadingCircle v-if="!isLoaded" />
    <div class="px-4 py-6 mx-auto">
      <Heading
        title="Musicians"
        :description="`${allTheMusic.length} records`"
      />
      <MusiciansAddMusician />
      <div class="text-right">
        <ToggleListButton
          @toggle-list-view="toggleListView"
          :isToggled="isToggled"
        />
      </div>
      <Search @search="search" />

      <MusiciansTable v-if="!noResults" :musicians="results" />

      <ul v-if="!isToggled && noResults" class="">
        <li v-for="musician in allTheMusic" :key="musician" class="flex">
          <ArtistCard :artistId="musician.id" :musician="musician" />
        </li>
      </ul>

      <MusiciansTable v-if="isToggled && noResults" :musicians="allTheMusic" />

      <Table v-if="isToggled && noResults">
        <TableHeader>
          <TableRow>
            <TableHead class="font-bold"> Name </TableHead>
            <TableHead class="font-bold"> Description </TableHead>
            <TableHead class="font-bold text-right"> Action </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ArtistRow
            v-for="musician in allTheMusic"
            :key="musician"
            :artistId="musician.id"
            :musician="musician"
          />
        </TableBody>
      </Table>

      <!-- <ul class="flex justify-between mt-6">
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
ul {
  // /**
  //  * User input values.
  //  */
  // --grid-layout-gap: 10px;
  // --grid-column-count: 6;
  // --grid-item--min-width: 100px;

  // /**
  //  * Calculated values.
  //  */
  // --gap-count: calc(var(--grid-column-count) - 1);
  // --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  // --grid-item--max-width: calc(
  //   (100% - var(--total-gap-width)) / var(--grid-column-count)
  // );

  // display: grid;
  // grid-template-columns: repeat(
  //   auto-fill,
  //   minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr)
  // );
  // grid-gap: var(--grid-layout-gap);
  display: grid;
  gap: 0.2em;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

  @media (min-width: 35em) {
    // grid-auto-columns: 1fr;
  }
}

li {
  // flex: 1 1 0px;

  // max-width: 260px;
  margin-right: 1rem;
  margin-bottom: 1rem;

  > div > a {
    max-height: 150px;
    overflow: hidden;
    position: relative;
    width: 100%;
    padding-bottom: 220px;
    display: block;
    object-fit: cover;

    @media (width >= 600px) {
      max-height: 280px;
    }

    img {
      max-width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      object-fit: cover;
    }
  }
}
.list-view {
  display: block;

  li > div {
    display: flex;
    margin-bottom: 2rem;
    max-width: 100%;
    justify-content: flex-start;
  }

  .card-image {
    width: 200px;
    max-height: 200px;
    padding-bottom: 180px;

    @media (width >= 600px) {
      max-height: 150px;
    }
  }
}
</style>
