<script setup>
const props = defineProps({
  lesson: Object,
});

const totalTakings = computed(
  () => props.lesson.taking_cash + props.lesson.taking_card
);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>
<template>
  <TableRow>
    <TableCell>
      {{ props.lesson.date }}
    </TableCell>
    <TableCell>
      {{ props.lesson.attendees }}
    </TableCell>
    <TableCell>
      {{ props.lesson.taking_card }}
    </TableCell>
    <TableCell>
      {{ props.lesson.taking_cash }}
    </TableCell>
    <TableCell>
      {{ totalTakings }}
    </TableCell>
    <TableCell>
      <span
        v-for="(teacher, i) in props.lesson.teachers"
        :key="`teacher${i}`"
        class="mr-2"
      >
        <span
          class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300"
          >{{ capitalizeFirstLetter(teacher) }}</span
        >
      </span>
    </TableCell>
    <TableCell>
      {{ props.lesson.class_theme }}
    </TableCell>
    <TableCell>
      <ClassSummary :lesson="props.lesson" />
      <ClassEditForm :lesson="props.lesson" />
    </TableCell>
  </TableRow>
</template>
