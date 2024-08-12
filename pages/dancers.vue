<script setup>
const supabase = useSupabaseClient();

const { data: dancers } = await supabase
  .from("dancers")
  .select()
  .eq("published", true)
  .order("name");

const categories = dancers.map((dancer) => dancer.gender);
const uniqueItems = new Set(categories);
const allCategories = [...uniqueItems].sort();

const selected = ref();

const filteredProducts = computed(() => {
  if (!selected.value) return dancers;
  return dancers.filter((dancer) => dancer.gender === selected.value);
});

const selectFilter = (category) => {
  selected.value === category
    ? (selected.value = null)
    : (selected.value = category);
};

const resetOptions = () => {
  selected.value = null;
};

function titleCase(string) {
  let sentence = string.toLowerCase();
  let titleCaseSentence =
    sentence.charAt(0).toUpperCase() + sentence.substring(1, sentence.length);
  return titleCaseSentence;
}
</script>

<template>
  <div>
    <Heading title="Dancers" :description="`${dancers?.length} records`" />
    <div class="flex items-start">
      <div class="w-3/12 mr-6">
        <Card class="p-6">
          <div class="space-6">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium">Filter</h3>
                <p class="text-sm text-muted-foreground">Filter below.</p>
              </div>
              <div
                data-orientation="horizontal"
                role="separator"
                class="shrink-0 bg-border relative h-px w-full"
              ></div>
              <form>
                <div class="space-y-2">
                  <div class="mb-4">
                    <label
                      for="radix-2078-form-item"
                      class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                    >
                      Gender
                    </label>
                  </div>
                  <div
                    class="flex items-center space-x-2"
                    v-for="(category, index) in allCategories"
                    :key="index"
                  >
                    <Checkbox
                      :id="category"
                      :checked="category == selected"
                      :name="category"
                      @update:checked="selectFilter(category)"
                    />
                    <label
                      :for="category"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >{{ titleCase(category) }}</label
                    >
                  </div>
                </div>
              </form>
            </div>

            <Button @click="resetOptions" class="mt-10"> Reset </Button>
          </div>
        </Card>
      </div>

      <div class="w-9/12 ml-4">
        <div class="relative">
          <div class="grid-container">
            <DancerCard
              :dancer="dancer"
              v-for="(dancer, index) in filteredProducts"
              :key="`${dancer}-${index}`"
            />
          </div>
        </div>
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
  --grid-column-count: 5;
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
