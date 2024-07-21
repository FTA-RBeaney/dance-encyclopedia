<template>
  <button
    class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-xl text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
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
