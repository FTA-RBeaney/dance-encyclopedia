<template>
  <a
    :href="`https://musicbrainz.org/release-group/${item.id}`"
    class="space-y-3 mb-4"
    aspect-ratio="square"
    target="_blank"
  >
    <div class="overflow-hidden rounded-md">
      <NuxtImg
        :src="albumImg"
        format="webp"
        preload
        loading="lazy"
        placeholder="https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png"
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

console.log(item);
</script>
