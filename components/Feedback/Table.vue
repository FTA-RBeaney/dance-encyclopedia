<script setup>
const props = defineProps({
  title: String,
  data: Array,
});
</script>

<template>
  <div class="mb-6">
    <p class="py-2 text-lg font-semibold">{{ props.title }}</p>
    <Card class="p-6">
      <Table v-if="props.data.length > 0">
        <TableHeader>
          <TableRow>
            <TableHead class="font-bold"> Bug </TableHead>
            <TableHead class="font-bold"> Created by </TableHead>
            <TableHead class="font-bold"> Created at</TableHead>
            <TableHead class="font-bold"> Status</TableHead>
            <tableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <FeedbackRow
            :item="item"
            v-for="(item, index) in props.data"
            :key="`item${index}`"
          />
        </TableBody>
      </Table>
      <p v-else>Nothing here *crickets*</p>
    </Card>
  </div>
</template>
