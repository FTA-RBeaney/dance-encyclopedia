<template>
  <NuxtLink
    class="space-y-3 mb-4"
    aspect-ratio="square"
    :to="`/dancer/${dancer.name}`"
  >
    <div class="overflow-hidden rounded-md">
      <img
        :src="dancer.image"
        :alt="dancer.name"
        width="150px"
        height="150px"
        class="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
      />
    </div>
    <div class="space-y-1 text-sm">
      <h3 class="font-medium leading-none">
        {{ dancer.name }}
      </h3>
      <p class="text-xs text-muted-foreground">
        {{ danceStyles }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  dancer: Object,
});
const { dancer } = props;
const danceStyles = computed(() =>
  dancer.styles.map((style) => style).join(", ")
);
</script>
