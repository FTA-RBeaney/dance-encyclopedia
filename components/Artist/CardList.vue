<template>
  <div>
    <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <li
        v-for="(musician, i) in props.musicians"
        :key="`musician-${i}`"
        class="flex"
      >
        <MotionGroup preset="fadeVisible" :duration="600">
          <ArtistCard :artistId="musician.id" :musician="musician" />
        </MotionGroup>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  musicians: Object,
});
</script>

<style scoped lang="scss">
// ul {
//   display: grid;
//   gap: 1em;
//   grid-template-columns: repeat(auto-fit, minmax(180px, 23%));
//   margin: 0 auto;
// }

li {
  margin-bottom: 1rem;

  > div > a {
    max-height: 150px;
    overflow: hidden;
    position: relative;
    width: 100%;
    padding-bottom: 220px;
    display: block;
    object-fit: cover;

    @media (width >= 600px) {
      max-height: 280px;
    }

    img {
      max-width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      object-fit: cover;
    }
  }
}
.list-view {
  display: block;

  li > div {
    display: flex;
    margin-bottom: 2rem;
    max-width: 100%;
    justify-content: flex-start;
  }

  .card-image {
    width: 200px;
    max-height: 200px;
    padding-bottom: 180px;

    @media (width >= 600px) {
      max-height: 150px;
    }
  }
}
</style>
