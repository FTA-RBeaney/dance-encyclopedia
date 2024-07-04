<script setup>
import { allRowsWorkshop } from "@/composables/useSheet";

const headings = ref(null);
const result = ref([]);
const { data } = await allRowsWorkshop();

headings.value = data.value.values[0];
result.value = [...data.value.values];
result.value.splice(0, 1);
</script>

<template>
  <div class="px-4 py-6">
    <Heading
      title="Trisha workshop"
      :description="`${result.length} attendees`"
    />

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="col in headings"
            :key="col"
            v-html="col"
            class="font-bold"
          >
          </TableHead>
          <TableHead class="font-bold text-right"> Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="col in result" :key="col">
          <TableCell class="font-medium w-3/12">
            {{ col[0] }}
          </TableCell>
          <TableCell class="font-medium">
            {{ col[1] }}
          </TableCell>
          <TableCell>{{ col[2] }} </TableCell>
          <TableCell class="font-bold text-right">
            <NuxtLink :to="`/sheet/${col[0]}`">View</NuxtLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
