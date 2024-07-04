<script setup lang="ts">
const data = {
  months: [
    {
      name: "Jan",
      total: 51,
    },
    {
      name: "Feb",
      total: 87,
    },
    {
      name: "Mar",
      total: 54,
    },
    {
      name: "Apr",
      total: 52,
    },
    {
      name: "May",
      total: 77,
    },
    {
      name: "Jun",
      total: 66,
    },
  ],

  weeks: [
    {
      name: "11/01/24",
      total: 16,
    },
    {
      name: "18/01/24",
      total: 18,
    },
    {
      name: "25/01/24",
      total: 17,
    },

    {
      name: "01/02/24",
      total: 12,
    },
    {
      name: "08/02/24",
      total: 21,
    },
    {
      name: "15/02/24",
      total: 18,
    },
    {
      name: "22/02/24",
      total: 21,
    },
    {
      name: "29/02/24",
      total: 15,
    },

    {
      name: "07/03/24",
      month: "Mar",
      total: 18,
    },
    {
      name: "14/03/24",
      month: "Mar",
      total: 15,
    },
    {
      name: "21/03/24",
      month: "Mar",
      total: 11,
    },
    {
      name: "28/03/24",
      month: "Mar",
      total: 10,
    },
    {
      name: "04/04/24",
      month: "Apr",
      total: 14,
    },
    {
      name: "11/04/24",
      month: "Apr",
      total: 17,
    },
    {
      name: "18/04/24",
      month: "Apr",
      total: 18,
    },
    {
      name: "25/04/24",
      month: "Apr",
      total: 17,
    },
    {
      name: "02/05/24",
      total: 16,
    },
    {
      name: "09/05/24",
      total: 16,
    },
    {
      name: "16/05/24",
      total: 13,
    },
    {
      name: "23/05/24",
      total: 16,
    },
    {
      name: "30/05/24",
      total: 16,
    },
    {
      name: "06/06/24",
      total: 24,
    },
    {
      name: "13/06/24",
      total: 16,
    },
    {
      name: "20/06/24",
      total: 14,
    },
    {
      name: "27/06/24",
      total: 12,
    },
  ],
};

const categories = ref(["weeks", "months"]);
const currentCategory = ref("weeks");
console.log(currentCategory);
</script>

<template>
  <div class="px-4 py-6">
    <Heading title="Classes" description="Information on class attendance" />

    <main>
      <Tabs default-value="weeks">
        <TabsList>
          <TabsTrigger
            :value="category"
            v-for="(category, index) in categories"
            :key="index"
          >
            {{ category }}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          v-for="(category, index) in categories"
          :value="category"
          :key="index"
        >
          <LineChart
            :data="data[category]"
            index="name"
            :categories="['total']"
            :colors="['green']"
            curveType="linear"
          />

          <Table class="w-10/12 mx-auto my-6">
            <TableHeader>
              <TableRow>
                <TableHead class="font-bold"> Date </TableHead>
                <TableHead class="font-bold text-right">
                  Number of people
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in data[category]" :key="item.name">
                <TableCell class="font-medium w-3/12">
                  {{ item.name }}
                </TableCell>
                <TableCell class="font-medium text-right">
                  {{ item.total }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
