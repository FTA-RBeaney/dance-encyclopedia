<template>
  <TableRow @click="toggleExpanded">
    <TableCell class="font-medium">
      <Badge variant="outline" class="rounded-sm mr-1">
        {{ item.type }}
      </Badge>
      {{ item.feedback_title }}
    </TableCell>
    <TableCell>
      <img
        v-if="item?.profiles.avatar_url"
        class="w-8 h-8 mr-2 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
        :src="item?.profiles.avatar_url"
        alt="Rounded avatar"
      />
      {{ item?.profiles.first_name }}
    </TableCell>
    <TableCell class="font-medium">
      {{ createDate(item.created_at) }}
    </TableCell>
    <TableCell>
      <div class="flex items-center">
        <div
          class="bg-green-400 rounded-full w-2 h-2 animate-pulse mr-2"
          :class="statusClass"
        ></div>
        {{ item.status }}
      </div>
    </TableCell>
  </TableRow>
  <Transition>
    <TableRow v-if="isExpanded">
      <TableCell colspan="3">
        <div class="flex-1 whitespace-pre-wrap p-2 text-sm">
          {{ item.feedback }}
        </div>
      </TableCell>
    </TableRow>
  </Transition>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

const { item } = props;
const isExpanded = ref(false);

const createDate = (createdeAt) =>
  new Date(createdeAt).toLocaleDateString("en-UK", {
    timeZone: "GMT",
  });

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    class: "bg-green-400",
    // icon: h(QuestionMarkCircledIcon),
  },
  {
    value: "not started",
    label: "Not started",
    class: "bg-red-400",
  },
  {
    value: "todo",
    label: "Todo",
    class: "bg-green-400",
    // icon: h(CircleIcon),
  },
  {
    value: "in progress",
    label: "In progress",
    class: "bg-yellow-400",
    // icon: h(StopwatchIcon),
  },
  {
    value: "done",
    label: "Done",
    class: "bg-green-400",
    // icon: h(CheckCircledIcon),
  },
  {
    value: "canceled",
    label: "Canceled",
    class: "bg-green-400",
    // icon: h(CrossCircledIcon),
  },
];

const status = statuses.find((status) => status.label === item.status);
const statusIcon = status.class;
const statusClass = status.class;

console.log(status);
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
