<script setup>
const props = defineProps({
  lesson: Object,
});
import { ReceiptText } from "lucide-vue-next";
const isOpen = ref();
const totalTakings = computed(
  () => props.lesson.taking_card + props.lesson.taking_cash
);
const cardFees = computed(() => (totalTakings.value / 100) * 1.75);
const totalMinusFees = computed(() => totalTakings.value - cardFees.value);

const totalTeachers = props.lesson.teachers.length;
const moneyPerTeacher = totalTakings.value / totalTeachers;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
</script>
<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline" @click="openDialog" class="mr-2"
        ><ReceiptText class="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Class details</DialogTitle>
      </DialogHeader>
      <div class="py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Lesson date</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ lesson.date.split("-").reverse().join("-") }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Attendees</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ lesson.attendees }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Takings on card</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ gbp.format(lesson.taking_card) }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Takings on cash</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ gbp.format(lesson.taking_cash) }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Total takings</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ gbp.format(totalTakings) }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Card fees</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ gbp.format(cardFees) }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Total minus fees</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ gbp.format(totalMinusFees) }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Rent</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ gbp.format(lesson.rent) }}
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Teacher breakdown</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div
                v-for="(teacher, i) in lesson.teachers"
                :key="`teacher${i}`"
                class="mb-2 flex justify-between"
              >
                <span
                  class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300"
                  >{{ capitalizeFirstLetter(teacher) }}</span
                >
                <span> {{ gbp.format(moneyPerTeacher) }} </span>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </DialogContent>
  </Dialog>
</template>
