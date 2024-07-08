<script setup>
const client = useSupabaseClient();

const { data } = await client
  .from("musicians")
  .select("id, name, years, wikipedia_link, spotify_link")
  .order("name");

const allMusicians = ref(data);
</script>

<template>
  <div class="px-4 py-6">
    <Heading
      title="Musicians"
      :description="`${allMusicians?.length} records`"
    />
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold"> Name </TableHead>
          <TableHead class="font-bold"> Years </TableHead>
          <TableHead class="font-bold text-right"> Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="musician in allMusicians" :key="musician.id">
          <TableCell class="font-medium">
            {{ musician.name }}
          </TableCell>
          <TableCell>{{ musician.years }} </TableCell>

          <TableCell class="font-bold text-right">
            <NuxtLink :to="`./artist/${musician.id}`">View</NuxtLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
