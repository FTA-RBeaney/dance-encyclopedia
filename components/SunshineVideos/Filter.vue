<script setup>
  const props = defineProps({
    filterOptions: Array,
  });
  const allCategories = ["Lindy Hop", "Solo"];
  const moveCategories = ["Tuck Turn", "Pass By", "Frankie Sixes", "Charleston"];
  const formatCategories = ["Competition", "Performance"];
  const selected = ref([]);

  const jobs = [
    { location: "Lindy", format: "Competition", move: "Tuck Turn" },
    { location: "Solo", format: "Performance", move: "Pass By" },
    { location: "Lindy", format: "Competition", move: "Frankie Sixes" },
    { location: "Solo", format: "Performance", move: "Charleston" },
  ];

  const selectFilter = (category) => {
    selected.value === category ? (selected.value = null) : (selected.value = category);
  };

  const resetOptions = () => {
    selected.value = null;
  };

  const emit = defineEmits(["filterItems"]);
  const handleFilter = (event) => {
    emit("filterItems", event);
  };
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>Filter</CardTitle>
      <CardDescription>Filter videos below</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-6">
        <form>
          <div class="space-y-6">
            <div class="space-y-2">
              <div class="mb-4">
                <label
                  for="radix-2078-form-item"
                  class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                  Style
                </label>
              </div>
              <!-- <div
                v-for="role in allCategories"
                :key="role">
                <input
                  type="checkbox"
                  v-model="user.roles"
                  :value="role" />
                <label>{{ role }}</label>
              </div> -->
              <RadioGroup default-value="all">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem
                    id="r2"
                    value="all"
                    @update:checked="handleFilter(category)" />
                  <Label for="r2">All</Label>
                </div>
                <div
                  v-for="(category, index) in filterOptions"
                  :key="index"
                  class="flex items-center space-x-2">
                  <RadioGroupItem
                    :id="category"
                    :value="category"
                    @update:checked="handleFilter(category)" />
                  <Label :for="category">{{ category }}</Label>
                </div>
              </RadioGroup>
            </div>
            <div class="space-y-2">
              <div class="mb-4">
                <label
                  for="radix-2078-form-item"
                  class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                  Format
                </label>
              </div>
              <div
                class="flex items-center space-x-2"
                v-for="(category, index) in formatCategories"
                :key="index">
                <Checkbox
                  :id="category"
                  :checked="category == selected"
                  :name="category"
                  @update:checked="selectFilter(category)" />
                <label
                  :for="category"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >{{ category }}</label
                >
              </div>
            </div>
            <div class="space-y-2">
              <div class="mb-4">
                <label
                  for="radix-2078-form-item"
                  class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                  Move
                </label>
              </div>
              <div
                class="flex items-center space-x-2"
                v-for="(category, index) in moveCategories"
                :key="index">
                <Checkbox
                  :id="category"
                  :checked="category == selected"
                  :name="category"
                  @update:checked="selectFilter(category)" />
                <label
                  :for="category"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >{{ category }}</label
                >
              </div>
            </div>
          </div>
        </form>
      </div>
    </CardContent>
    <CardFooter><Button> Reset </Button></CardFooter>
  </Card>
</template>
