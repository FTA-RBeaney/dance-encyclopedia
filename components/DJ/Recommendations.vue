<script setup>
const props = defineProps({
  filteredItems: Object,
});

const { artistId, trackId } = toRefs(props);
</script>

<template>
  <Card class="p-4">
    <h3 class="text-lg font-medium mb-4">Recommended songs:</h3>
    <div
      v-for="(rec, i) in filteredItems"
      :key="`rec${i}`"
      class="flex truncate mb-2"
    >
      <img
        class="w-10 h-10 object-cover rounded-lg mr-0"
        alt="User avatar"
        :src="rec.album.images[0].url"
      />
      <Button
        variant="link"
        @click="$emit('changeTrack', rec, rec.album.images[0].url)"
        >{{ rec.name }}</Button
      >
    </div>
  </Card>
</template>
