<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();

const { data: dancers } = await useAsyncData("dancers", async () => {
  const { data } = await client
    .from("dancers")
    .select("id, name, image")
    // .eq("user", user.value.id)
    .order("name");

  return data;
});
</script>

<template>
  <div class="px-4 py-6">
    <Heading title="Dancers" :description="`${dancers.length} records`" />

    <!-- <div class="mt-6 space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">Made for You</h2>
      <p class="text-sm text-muted-foreground">
        Your personal playlists. Updated daily.
      </p>
    </div> -->
    <Separator class="my-4" />
    <div class="relative">
      <div class="grid-container">
        <a
          v-for="dancer in dancers"
          :key="dancer"
          href="google"
          class="space-y-3 mb-4"
          aspect-ratio="square"
          target="_blank"
        >
          <div class="overflow-hidden rounded-md">
            <img
              :src="dancer.image"
              :alt="dancer.name"
              width="150px"
              height="150px"
              class="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
            />
          </div>
          <div class="space-y-1 text-sm">
            <h3 class="font-medium leading-none">
              {{ dancer.name }}
            </h3>
            <!-- <p class="text-xs text-muted-foreground">Hi</p> -->
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
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
</style>
