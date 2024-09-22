<script setup>
definePageMeta({
  layout: "classes",
});

import _mean from "lodash/mean";

const supabase = useSupabaseClient();

const { data: classData, refresh } = await useAsyncData(
  "getClasses",
  async () => {
    const { data, allError } = await supabase
      .from("classes")
      .select("*")
      .order("date", { ascending: true });

    return data;
  }
);

const { data: attendeesData, refresh: refreshAttendees } = await useAsyncData(
  "getAttendees",
  async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("date, attendees")
      .order("date", { ascending: true });

    return data;
  }
);

const { data: takingData, refresh: refreshTakings } = await useAsyncData(
  "getTakings",
  async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("date, taking_card, taking_cash")
      .order("date", { ascending: true });

    return data;
  }
);

let allTakings = computed(() => {
  const mappedCash = classData.value.map((entry) => entry.taking_cash);
  const mappedCard = classData.value.map((entry) => entry.taking_card);
  const mergedArray = [...mappedCash, ...mappedCard];
  return mergedArray;
});

const dataFormatter = (number) =>
  `$${Intl.NumberFormat("us").format(number).toString()}`;

async function refreshData() {
  refresh();
  refreshAttendees();
  refreshTakings();
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <Heading title="Classes" description="Information on class attendance" />
      <!-- <NuxtLink to="/add-lesson"
        ><Button
          ><CirclePlus class="w-3 h-3 mr-2" />Add lesson</Button
        ></NuxtLink
      > -->
    </div>

    <main>
      <div class="flex justify-between mb-6">
        <ClassAverageCard
          title="Average"
          :data="allTakings"
          icon="PiggyBank"
          :currency="true"
        />

        <ClassAverageCard
          title="Avg. card"
          :data="classData"
          property="taking_card"
          :currency="true"
          icon="HandCoins"
        />

        <ClassAverageCard
          title="Avg. cash"
          :data="classData"
          property="taking_cash"
          :currency="true"
          icon="CreditCard"
        />

        <ClassAverageCard
          title="Avg. attendees"
          :data="classData"
          property="attendees"
          icon="Users"
        />
      </div>

      <div class="flex mt-6">
        <Card class="w-6/12 mr-6">
          <CardHeader>
            <CardTitle>Attendees </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              index="date"
              :data="attendeesData"
              :categories="['attendees']"
              :rounded-corners="4"
              :show-x-axis="false"
            />
          </CardContent>
        </Card>
        <Card class="w-6/12">
          <CardHeader>
            <CardTitle>Takings </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              :data="takingData"
              index="date"
              :categories="['taking_cash', 'taking_card']"
              :colors="['blue', 'pink', 'orange', 'red']"
              :show-x-axis="false"
            />
          </CardContent>
        </Card>
      </div>
      <div class="flex mt-6 w-full">
        <div class="w-8/12 xl:w-8/12 mr-6">
          <ClassList :classData="classData" />
        </div>
        <div class="w-4/12 xl:w-4/12 mt-6 xl:mt-0">
          <AddLesson @refresh-data="refreshData" />
        </div>
      </div>
    </main>
  </div>
</template>
