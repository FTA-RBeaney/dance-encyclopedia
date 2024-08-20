<script setup>
const props = defineProps({});

const supabase = useSupabaseClient();
const { data: attendeesData, refresh: refreshAttendees } = await useAsyncData(
  "attendees",
  async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("date, attendees")
      .order("date", { ascending: true });

    return data;
  }
);

const { data: takingData, refresh: refreshTakings } = await useAsyncData(
  "taking",
  async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("date, taking_card, taking_cash")
      .order("date", { ascending: true });

    return data;
  }
);
</script>

<template>
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
      />
    </CardContent>
  </Card>
  <Card class="w-6/12">
    <CardHeader>
      <CardTitle>Takings </CardTitle>
    </CardHeader>
    <CardContent>
      <LineChart
        :data="takingData"
        index="date"
        :categories="['taking_cash', 'taking_card']"
        :colors="['blue', 'pink', 'orange', 'red']"
      />
    </CardContent>
  </Card>
</template>
