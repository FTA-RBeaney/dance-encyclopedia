<template>
  <div class="py-4">
    <h1 class="text-6xl font-bold text-neutral-700 dark:text-white">
      {{ title }}
    </h1>
    <p v-if="description" class="mt-4 text-2xl text-neutral-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});
</script>
