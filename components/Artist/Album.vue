<template>
  <a href="google" class="space-y-3 mb-4" aspect-ratio="square" target="_blank">
    <div class="overflow-hidden rounded-md">
      <NuxtImg
        :src="albumImg"
        format="webp"
        preload
        loading="lazy"
        placeholder="https://archive.org/download/placeholder-image/placeholder-image.jpg"
        :alt="item.title"
        width="300"
        height="300"
        class="h-full w-full object-cover transition-all hover:scale-105 aspect-square"
        @load="isLoaded"
      />
    </div>
    <div class="space-y-1 text-sm">
      <h3 class="font-medium leading-none">
        {{ item.title }}
      </h3>
      <p class="text-xs text-muted-foreground">
        {{ item["first-release-date"] }}
      </p>
    </div>
  </a>
</template>

<script setup>
const props = defineProps({
  item: Object,
});
const { item } = props;

const imageIsLoaded = ref(false);

const isLoaded = () => {
  imageIsLoaded.value = true;
};

const imageLoadError = () => {
  console.log("image error");
};

const albumImg = `https://coverartarchive.org/release-group/${item.id}/front`;
</script>
