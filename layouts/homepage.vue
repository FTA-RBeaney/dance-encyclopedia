<script setup>
const supabaseUser = useSupabaseUser();

const isLoggedIn = ref();
const isLoggedInClasses = computed(() =>
  isLoggedIn ? "col-span-3 lg:col-span-4" : "col-span-5 lg:col-span-5"
);

const showHideSpinner = ref(true);

onBeforeMount(() => {
  showHideSpinner.value = true;
  isLoggedIn.value = supabaseUser.value;
});

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
        <div class="lg:grid lg:grid-cols-5 min-h-screen">
          <Sidebar v-if="supabaseUser" class="hidden lg:block" />
          <div
            id="main-content"
            class="main-content lg:border-l relative"
            :class="isLoggedInClasses"
          >
            <div class="h-screen">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
