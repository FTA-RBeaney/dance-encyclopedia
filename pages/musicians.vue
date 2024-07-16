<script setup>
const isLoaded = ref(false);
const isToggled = ref(false);

const supabase = useSupabaseClient();
const allTheMusic = ref([]);

// get musicians
const getMusicians = async () => {
  const { data, error } = await supabase.from("musicians").select("*");

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

onMounted(() => {
  getMusicians();
});

onUnmounted(() => {
  supabase.removeChannel(channel);
});

// change loaded state on mount
onMounted(async () => {
  return (isLoaded.value = true);
});
</script>

<template>
  <div class="w-full h-full">
    <LoadingCircle v-if="!isLoaded" />
    <div class="px-4 py-6">
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
      <ul v-if="!isToggled" class="flex">
        <li v-for="musician in allTheMusic" :key="musician" class="flex">
          <ArtistCard :artistId="musician.id" :musician="musician" />
        </li>
      </ul>
      <Table v-else>
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

      <ul class="flex justify-between mt-6">
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
ul {
  /**
   * User input values.
   */
  --grid-layout-gap: 10px;
  --grid-column-count: 6;
  --grid-item--min-width: 100px;

  /**
   * Calculated values.
   */
  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc(
    (100% - var(--total-gap-width)) / var(--grid-column-count)
  );

  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr)
  );
  grid-gap: var(--grid-layout-gap);
}

li {
  flex: 0 0 calc(25% - 30px);

  > div > a {
    max-height: 150px;
    overflow: hidden;
    position: relative;
    width: 100%;
    padding-bottom: 200px;
    display: block;
    object-fit: cover;

    @media (width >= 600px) {
      max-height: 260px;
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
