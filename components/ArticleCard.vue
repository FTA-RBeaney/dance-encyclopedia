<template>
  <div
    key=""
    to=""
    class="article-card dark:bg-gray-800 container mx-auto grid rounded-xl bg-clip-border overflow-hidden shadow-md bg-white"
  >
    <img
      src="https://images.squarespace-cdn.com/content/v1/56841850cbced6a015738a0a/1469554724689-6ZOS1XJUP5QP8NTC3ZIH/image-asset.jpeg?format=2500w"
      class="card-image"
    />
    <div class="px-4 py-4">
      <p v-if="move" class="font-bold text-neutral-700 uppercase">
        Type of thing
      </p>
      <div>
        <h2 id="title" class="text-xl font-bold text-neutral-700">
          {{ move.name }}
        </h2>
        <p class="line-clamp-2 mt-2 text-neutral-500">Article description</p>
      </div>
      <div class="flex mt-2">
        <img
          src="https://images.squarespace-cdn.com/content/v1/56841850cbced6a015738a0a/1469554724689-6ZOS1XJUP5QP8NTC3ZIH/image-asset.jpeg?format=2500w"
          style="border-radius: 50%; object-fit: cover"
          width="40"
          height="40"
          alt="Article title"
        />
        <span v-if="move" class="px-2 self-center text-neutral-700">
          Author's name
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  article: Object,
  move: Object,
});
</script>

<style scoped>
.card-image {
  height: 200px;
  object-fit: cover;
}
</style>
