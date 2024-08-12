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
    <Heading v-if="response?.name" :title="response.name" class="mb-6" />
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
