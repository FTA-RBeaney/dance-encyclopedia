<script setup lang="ts">
import ExpensesChartTooltip from "../components/Expenses/ChartTooltip.vue";
import { columns } from "../components/Expenses/columns";
const supabase = useSupabaseClient();

const { data, refresh } = await useAsyncData("getExpenses", async () => {
  const { data } = await supabase
    .from("expenses")
    .select(`*,profiles(*)`)
    .order("created_at", { ascending: false });

  return data;
});

const totalled = computed(() => {
  const result = Object.groupBy(data.value, ({ type }) => type);

  var newResult = {
    data: data.value.map(function (item) {
      return {
        type: item.type,
        amount: item.amount,
      };
    }),
  };

  const finalResult = Object.values(
    newResult.data.reduce((agg, item) => {
      if (agg[item.type] === undefined)
        agg[item.type] = { name: item.type, sumQuantity: 0 };
      agg[item.type].sumQuantity += +item.amount;
      return agg;
    }, {})
  );

  return finalResult;
});

const valueFormatter = (tick: number | Date) =>
  typeof tick === "number"
    ? `£ ${new Intl.NumberFormat("us").format(tick).toString()}`
    : "";

let gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

async function refreshData() {
  refresh();
}
</script>

<template>
  <div>
    <Heading title="Expenses" description="Add your expenses below" />
    <div class="flex">
      <div class="w-7/12">
        <div class="flex mb-4">
          <div class="w-6/12 mr-4">
            <AddExpense @refresh-data="refreshData" class="mb-4 h-full" />
          </div>
          <div class="w-6/12">
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  title="Expenses"
                  index="name"
                  :category="'sumQuantity'"
                  :data="totalled"
                  :type="'pie'"
                  :value-formatter="valueFormatter"
                  :custom-tooltip="ExpensesChartTooltip"
                />

                <Table class="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="(total, i) in totalled" :key="`total${i}`">
                      <TableCell>{{ total.name }}</TableCell>
                      <TableCell>{{ gbp.format(total.sumQuantity) }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        <div class="flex">
          <Card class="w-full">
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesDataTable :data="data" :columns="columns" />
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="w-5/12 max-w-md"></div>
    </div>
  </div>
</template>
