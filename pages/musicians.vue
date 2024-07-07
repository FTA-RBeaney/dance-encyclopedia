<script setup lang="ts">
import { useRouter } from "vue-router";
const client = useSupabaseClient();

const { data: musicians } = await useAsyncData("musicians", async () => {
  const { data } = await client
    .from("musicians")
    .select("id, name, years, wikipedia_link, spotify_link")
    .order("name");

  return data;
});

const allMusicians = ref(musicians);
</script>

<template>
  <div class="px-4 py-6">
    {{ $content }}
    <Heading title="Musicians" :description="`${musicians?.length} records`" />
    <Table>
      <TableHeader>
        <TableRow>
          <!-- <TableHead
            v-for="(col, index) in headings.slice(1)"
            :key="col"
            class="font-bold"
          >
          </TableHead> -->
          <TableHead class="font-bold"> Name </TableHead>
          <TableHead class="font-bold"> Years </TableHead>
          <TableHead class="font-bold text-right"> Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="musician in musicians" :key="musician.id">
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
