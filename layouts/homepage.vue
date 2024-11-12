<script setup>
const supabaseUser = useSupabaseUser();

const isLoggedIn = ref();
const isLoggedInClasses = computed(() =>
  supabaseUser.value ? "col-span-8 lg:col-span-9" : "col-span-12 lg:col-span-12"
);

const showHideSpinner = ref(true);

showHideSpinner.value = true;
isLoggedIn.value = supabaseUser.value;

onMounted(async () => {
  showHideSpinner.value = false;
});
</script>

<template>
  <div>
    <div class="flex flex-col justify-between text-neutral-900">
      <Navbar />
    </div>
    <div class="border-t">
      <div class="bg-background">
        <div class="lg:grid min-h-screen">
          <div class="lg:flex min-h-screen">
            <Card
              v-if="supabaseUser"
              class="rounded-none -mt-0.5 max-w-[300px] basis-1/4"
            >
              <Sidebar class="hidden lg:block" />
            </Card>
            <div
              id="main-content"
              class="main-content w-full relative col-auto"
            >
              <div class="min-h-screen pb-8">
                <slot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
