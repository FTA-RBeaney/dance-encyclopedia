<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="font-bold"> Name </TableHead>
        <TableHead class="font-bold"> Description </TableHead>
        <TableHead class="font-bold text-right"> Action </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <ArtistRow
        v-for="musician in musicians"
        :key="musician"
        :artistId="musician.id"
        :musician="musician"
      />
    </TableBody>
  </Table>
</template>

<script setup>
const props = defineProps({
  musicians: Array,
});
</script>
