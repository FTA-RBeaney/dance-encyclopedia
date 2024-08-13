<script setup>
import { Maximize2 } from "lucide-vue-next";
const props = defineProps({
  row: Object,
});

const range = (row) => {
  const newRange = row.getVisibleCells();
  return newRange.slice(1);
};
const isExpanded = ref(false);
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
<template>
  <TableRow>
    <TableCell @click="toggleExpanded" class="cursor-pointer hover:underline">
      <div class="flex items-center">
        <Maximize2 class="w-4 h-4 mr-2" />
        {{ props.row.getValue("name") }}
      </div>
    </TableCell>
    <TableCell v-for="cell in range(props.row)" :key="cell.id" class="py-2">
      <!-- <pre>{{ cell }}</pre> -->
      <FlexRender
        :render="cell.column.columnDef.cell"
        :props="cell.getContext()"
      />
    </TableCell>
  </TableRow>
  <TableRow v-if="row.getIsExpanded()">
    <TableCell :colspan="props.row.getAllCells().length">
      <p>Hi</p>
      <AlbumsRecommendations :filteredItems="props.row.original.spotify_info" />
    </TableCell>
  </TableRow>
</template>
