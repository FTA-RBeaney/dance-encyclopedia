<script setup>
const isToggled = ref(false);

const supabase = useSupabaseClient();
const allTheMusic = ref();

// get musicians
const getMusicians = async () => {
  try {
    const { data, error } = await supabase
      .from("musicians")
      .select("*")
      .order("name", { ascending: true });

    allTheMusic.value = data;
  } catch (e) {
    allTheMusic.value = "Couldn't fetch data :(";
  }
};

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

await getMusicians();
onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>

<template>
  <div class="w-full h-full">
    <div>
      <Heading
        title="Musicians"
        :description="`${allTheMusic.length} records`"
      />
      <div class="flex w-full justify-between align-center mb-8">
        <MusiciansAddMusician />
        <Search @search="search" class="w-96" />
        <div class="text-right">
          <ToggleListButton
            v-if="noResults"
            @toggle-list-view="toggleListView"
            :isToggled="isToggled"
          />
        </div>
      </div>
      <div
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden mt-6"
      >
        <MusiciansTable v-if="!noResults" :musicians="results" />

        <ul v-if="!isToggled && noResults" class="">
          <li v-for="musician in allTheMusic" :key="musician" class="flex">
            <ArtistCard :artistId="musician.id" :musician="musician" />
          </li>
        </ul>

        <MusiciansTable
          v-if="isToggled && noResults"
          :musicians="allTheMusic"
        />

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
      </div>
    </div>
    <!-- <ul class="flex justify-between mt-6">
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul> -->
  </div>
</template>

<style scoped lang="scss">
ul {
  display: grid;
  gap: 0.2em;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

li {
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
