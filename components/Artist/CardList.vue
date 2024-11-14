<script setup>
const supabase = useSupabaseClient();

const { data: musicians } = await useAsyncData(
  "cardListMusicians",
  async () => {
    const { data, error } = await supabase
      .from("musicians")
      .select()
      .order("name", { ascending: true });
    return data;
  }
);

console.log("musc", musicians);
</script>

<template>
  <div>
    <ul
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 w-full"
    >
      <li
        v-for="(musician, i) in musicians"
        :key="`musician-${i}`"
        class="flex w-full"
      >
        <ArtistCard :artistId="musician.id" :musician="musician" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
li {
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
