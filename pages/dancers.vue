<script setup>
const client = useSupabaseClient();

const { data: dancers } = await client
  .from("dancers")
  .select(
    `
    *,
      profiles(
        *
      )
    `
  )
  .order("name");
</script>

<template>
  <div>
    <Heading title="Dancers" :description="`${dancers?.length} records`" />

    <!-- <div class="mt-6 space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">Made for You</h2>
      <p class="text-sm text-muted-foreground">
        Your personal playlists. Updated daily.
      </p>
    </div> -->
    <Separator class="my-4" />
    <div class="relative">
      <div class="grid-container">
        <DancerCard
          v-for="(dancer, index) in dancers"
          :dancer="dancer"
          :key="`dancer-${index}`"
        />
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
