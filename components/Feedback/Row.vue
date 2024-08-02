<template>
  <TableRow>
    <TableCell @click="toggleExpanded" class="font-medium cursor-pointer">
      <Badge variant="outline" class="rounded-sm mr-1">
        {{ item.type.value }}
      </Badge>
      {{ item.feedback_title.value }}
    </TableCell>
    <TableCell>
      <img
        v-if="item?.profiles.value.avatar_url"
        class="w-8 h-8 mr-2 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top"
        :src="item?.profiles.value.avatar_url"
        alt="Rounded avatar"
      />
      {{ item?.profiles.value.first_name }}
    </TableCell>
    <TableCell class="font-medium">
      {{ createDate(item.created_at.value) }}
    </TableCell>
    <TableCell>
      <div class="flex items-center">
        <div
          class="bg-green-400 rounded-full w-2 h-2 animate-pulse mr-2"
          :class="feedbackStatus.class"
        ></div>
        {{ feedbackStatus?.label }}
      </div>
    </TableCell>
    <TableCell>
      <FeedbackEdit :feedback="item" :statuses="statuses" />
    </TableCell>
  </TableRow>
  <Transition>
    <TableRow v-if="isExpanded">
      <TableCell colspan="3">
        <div class="flex-1 whitespace-pre-wrap p-2 text-sm">
          {{ item.feedback.value }}
        </div>
      </TableCell>
    </TableRow>
  </Transition>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

const item = toRefs(props.item);
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
    value: "to do",
    label: "To Do",
    class: "bg-red-400",
    // icon: h(QuestionMarkCircledIcon),
  },
  {
    value: "in progress",
    label: "In Progress",
    class: "bg-yellow-400",
    // icon: h(StopwatchIcon),
  },
  {
    value: "testing",
    label: "Testing",
    class: "bg-purple-400",
  },

  {
    value: "done",
    label: "Done",
    class: "bg-green-400",
    // icon: h(CheckCircledIcon),
  },
];

const feedbackStatus = computed(() =>
  statuses.find((status) => status.value === item.feedback_status.value)
);
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
