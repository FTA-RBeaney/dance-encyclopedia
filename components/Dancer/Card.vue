<template>
  <NuxtLink
    class="space-y-3 h-full w-full flex overflow-hidden"
    aspect-ratio="square"
    :to="`/dancer/${dancer.name}`"
  >
    <Card class="overflow-clip rounded-md w-full">
      <div>
        <img
          :src="dancer.image"
          :alt="dancer.name"
          width="150px"
          height="150px"
          class="h-auto w-full object-cover transition-all hover:scale-105 aspect-square"
          placeholder="https://res.cloudinary.com/dgbn0ttzf/image/upload/v1721434977/person-placeholder_ztoak6.png"
          @error="
            $event.target.src =
              'https://archive.org/download/placeholder-image/placeholder-image.jpg'
          "
        />
      </div>
      <slot />
      <div class="space-y-1 text-sm px-4 py-3">
        <h3 class="font-medium leading-none">
          {{ dancer.name }}
        </h3>
        <p v-if="dancer.birth_year" class="text-xs text-muted-foreground">
          <span v-if="dancer.birth_year">
            {{ createDate(dancer.birth_year) }}</span
          >
          <span v-if="dancer.death_year">
            - {{ createDate(dancer.death_year) }}
          </span>
        </p>
      </div>
    </Card>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  dancer: Object,
});

const { dancer } = toRefs(props);

var options = { year: "numeric", timeZone: "GMT" };

const createDate = (createdAt) =>
  new Date(createdAt).toLocaleDateString("en-UK", options);
</script>
