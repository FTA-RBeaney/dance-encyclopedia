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
              <div
                class="flex items-center space-x-2"
                v-for="(category, index) in allCategories"
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
