<script setup>
import { columns } from "../components/Musicians/columns.ts";
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

const ComponentToRender = computed(() => {
  if (!noResults.value) {
    return {
      name: resolveComponent("MusiciansTable"),
      dataToSend: results.value,
    };
  } else if (!isToggled.value && noResults.value) {
    return {
      name: resolveComponent("ArtistCardList"),
      dataToSend: allTheMusic.value,
    };
  } else {
    return {
      name: resolveComponent("MusiciansTable"),
      dataToSend: allTheMusic.value,
    };
  }
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
        <!-- <Search @search="search" class="w-96" /> -->
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
        <!-- <component
          :is="ComponentToRender.name"
          :musicians="ComponentToRender.dataToSend"
        /> -->

        <MusiciansDataTable
          :columns="columns"
          :data="allTheMusic"
          class="mt-4"
        />
      </div>
    </div>
  </div>
</template>
