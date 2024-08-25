<template>
  <button
    class="text-[#24292F] focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-xl text-sm p-0 text-center inline-flex items-center"
    :class="extraClasses"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  extraClasses: String,
});
</script>
