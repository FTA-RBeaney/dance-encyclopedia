<script setup>
const supabaseUser = useSupabaseUser();
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
            class="main-content col-span-3 lg:col-span-4 lg:border-l relative"
            :class="!supabaseUser && 'col-span-5 lg:col-span-5'"
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
