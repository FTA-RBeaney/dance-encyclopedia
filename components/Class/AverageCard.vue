<script setup>
import _mean from "lodash/mean";
import * as lucideIcons from "lucide-vue-next";

const props = defineProps({
  title: String,
  data: Object,
  property: String,
  currency: Boolean,
  icon: String,
});

const newData = reactive(props);

const mapping = computed(() => {
  let mappedData;
  if (props.property) {
    mappedData = newData.data.map((entry) => entry[props.property]);
  } else {
    mappedData = newData.data.map((entry) => entry);
  }

  if (props.currency) {
    return gbp.format(_mean(mappedData));
  }
  return Math.ceil(_mean(mappedData));
});

let gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
</script>

<template>
  <Card class="w-[30%] mr-4 relative">
    <CardHeader>
      <CardTitle>
        <div class="flex justify-between">
          {{ title }}
          <component :is="lucideIcons[icon]" class="" /></div
      ></CardTitle>
    </CardHeader>
    <CardContent> {{ mapping }}</CardContent>
  </Card>
</template>
