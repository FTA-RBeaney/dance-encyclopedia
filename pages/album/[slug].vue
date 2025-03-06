<template>
  <div>
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/musicians"> Home </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink :href="`/artist/${response?.artists[0].name}`">
            {{ response?.artists[0].name }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ response?.name }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Heading
      v-if="response?.name"
      :title="response.name"
      class="mb-6"
    />
    <a
      v-if="response?.external_urls?.spotify"
      :href="response?.external_urls?.spotify"
      target="_blank"
      class="inline-flex justify-center items-center text-xs px-8 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 mb-4"
      >Listen on Spotify <IconsSpotify
    /></a>

    <PlaylistTrackListing
      :tracks="response?.tracks?.items"
      :trackImage="response?.images[0].url"
    />
  </div>
</template>

<script setup>
  const nuxtApp = useNuxtApp();
  const route = useRoute();

  const getArtistAlbum = nuxtApp.getArtistAlbum;
  const albumId = route.params.slug;
  const response = ref();

  const res = await getArtistAlbum(albumId);
  response.value = res;
</script>
