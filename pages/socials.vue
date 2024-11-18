<script setup>
var options = {
  chart: {
    height: 280,
    type: "area",
  },
  dataLabels: {
    enabled: false,
  },
  series: [
    {
      name: "BGR Attendance",
      data: [45, 52, 38, 45, 19, 23, 2],
    },
  ],
  stroke: {
    width: 2,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100],
    },
  },
  xaxis: {
    categories: [
      "14 Jan",
      "28 Jan",
      "11 Feb",
      "25 Feb",
      "10 Mar",
      "24 Mar",
      "07 Apr",
      "21 Apr",
      "05 May",
      "19 May",
      "02 Jun",
      "16 Jun",
      "30 Jun",
      "14 Jul",
      "11 Aug",
      "25 Aug",
      "08 Sept",
      "22 Sept",
      "6th Oct",
      "20th Oct",
      "3rd Nov",
      "17th Nov",
    ],
  },
};

const series = [
  {
    name: "2023",
    data: [
      24, 13, 22, 29, 31, 31, 28, 24, 29, 25, 21, 26, 28, 27, 33, 19, 29, 36,
      27, 29, 22, 34, 47, 71,
    ],
  },
  {
    name: "2024",
    data: [
      58, 65, 40, 47, 44, 98, 38, 38, 47, 39, 53, 37, 45, 70, 53, 29, 32, 31,
      35, 31, 37, 27,
    ],
  },
];
</script>

<template>
  <div>
    <Heading
      title="Socials"
      description="Information on attendance for Brixton's Got Rhythm"
    />
    <div class="flex gap-6">
      <div class="w-8/12">
        <Card class="">
          <CardHeader>
            <CardTitle>BGR </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientOnly>
              <apexchart
                type="area"
                :options="options"
                :series="series"
              ></apexchart>
            </ClientOnly>
          </CardContent>
        </Card>
      </div>
      <div class="w-4/12">
        <Card class="">
          <CardHeader> </CardHeader>
          <CardContent>
            <div class="relative overflow-x-auto">
              <table
                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Date</th>
                    <th scope="col" class="px-6 py-3">Number of guests</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in options.xaxis.categories"
                    :key="`item${i}`"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {{ item }}
                    </th>
                    <td class="px-6 py-4">
                      {{ series[0].data[i] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
