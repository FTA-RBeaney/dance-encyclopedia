<script setup>
const props = defineProps({
  filteredAttendees: Object,
  totalled: Object,
});

import _meanBy from "lodash/meanBy";
import _countBy from "lodash/countBy";
import _maxBy from "lodash/maxBy";
import _map from "lodash/map";

const mean_val = computed(() =>
  _meanBy(props.filteredAttendees, function (o) {
    return o.donation;
  })
);

const valueFormatter = (tick) =>
  typeof tick === "number"
    ? `£ ${new Intl.NumberFormat("us").format(tick).toString()}`
    : "";

const mostFrequent = computed(() => {
  const allDonations = _map(props.filteredAttendees, "donation");
  let freq = _countBy(allDonations);
  return _maxBy(Object.keys(freq), (o) => freq[o]);
});
</script>

<template>
  <div class="flex justify-between items-center">
    <div>
      <Table>
        <TableBody>
          <TableRow v-if="filteredAttendees">
            <TableCell> Attendees: </TableCell>
            <TableCell>
              {{ filteredAttendees.length }}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Most common donation: </TableCell>
            <TableCell> £{{ mostFrequent }} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Average donation: </TableCell>
            <TableCell> £{{ mean_val.toFixed(2) }} </TableCell>
          </TableRow>
          <TableRow v-for="(item, i) in totalled">
            <TableCell>
              <span class="capitalize">{{ item.name }}</span
              >:
            </TableCell>
            <TableCell>
              <span>£{{ item.sumQuantity }}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div>
      <DonutChart
        class="h-48 w-48"
        index="donation_type"
        :category="'sumQuantity'"
        :value-formatter="valueFormatter"
        :data="totalled"
        show-legend
      />
    </div>
  </div>
</template>
