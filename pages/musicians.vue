<script setup>
import { columns } from "../components/Musicians/columns.ts";
import { RealtimeChannel } from "@supabase/supabase-js";
let realtimeChannel = RealtimeChannel;

const supabase = useSupabaseClient();

const allTheMusic = ref();
const isToggled = ref(false);

// get musicians
const { data, refresh } = await useAsyncData("musicians", async () => {
  const { data, error } = await supabase
    .from("musicians")
    .select("*")
    .order("name", { ascending: true });

  return data;
});

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

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>

<template>
  <div class="w-full h-full">
    <div>
      <Heading title="Musicians" :description="`${data.length} records`" />
      <div class="flex w-full justify-between align-center mb-8">
        <MusiciansAddMusician />

        <Search @search="search" class="w-96" />
        <div class="text-right">
          <MusiciansToggleList
            v-if="noResults"
            @toggle-list-view="toggleListView"
            :isToggled="isToggled"
          />
        </div>
      </div>
      <div
        class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-12/12 h-full flex flex-col overflow-hidden mt-6"
      >
        <div v-if="!isToggled && !noResults">
          <ArtistCardList :musicians="results" />
        </div>

        <MusiciansDataTable
          :columns="columns"
          :data="data"
          class="mt-4"
          v-else-if="isToggled"
        />

        <div v-else>
          <ArtistCardList :musicians="data" />
        </div>
      </div>
    </div>
  </div>
</template>
