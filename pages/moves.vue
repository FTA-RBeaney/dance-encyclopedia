<template>
  <div>
    <Heading
      title="Dance Encyclopedia"
      description="For all your swing dance info needs"
    />

    <main>
      <Articles :moves="moves" />
    </main>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  global: Object,
  moves: Object,
});
</script>
