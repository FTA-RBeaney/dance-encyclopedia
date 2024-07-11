<script setup>
const client = useSupabaseClient();

const isLoaded = ref(false);

const allMusicians = ref([]);

const musicianId = [
  "3af06bc4-68ad-4cae-bb7a-7eeeb45e411f",
  "54799c0e-eb45-4eea-996d-c4d71a63c499",
];

// change loaded state on mount
onMounted(async () => {
  return (isLoaded.value = true);
});
</script>

<template>
  <div class="w-full h-full">
    <LoadingCircle v-if="!isLoaded" />
    <div class="px-4 py-6">
      <Heading
        title="Musicians"
        :description="`${musicianId?.length} records`"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="font-bold"> Name </TableHead>
            <TableHead class="font-bold"> Country </TableHead>
            <TableHead class="font-bold"> Born </TableHead>
            <TableHead class="font-bold"> Died </TableHead>
            <TableHead class="font-bold text-right"> Action </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ArtistRow
            v-for="musician in musicianId"
            :key="musician"
            :artistId="musician"
          />
          <!-- <TableRow v-for="musician in allMusicians" :key="musician">
          <TableCell class="font-medium">
            {{ musician }}
          </TableCell>
          <TableCell>{{ musician }} </TableCell>

          <TableCell class="font-bold text-right">
            <NuxtLink :to="`/artist/${musician}`">View</NuxtLink>
          </TableCell>
        </TableRow> -->
        </TableBody>
      </Table>
    </div>
  </div>
</template>
