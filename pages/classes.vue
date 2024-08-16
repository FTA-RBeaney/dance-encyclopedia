<script setup>
definePageMeta({
  layout: "classes",
});

import { data } from "../data/classes";
const supabase = useSupabaseClient();
const categories = ref(["weeks", "months"]);
const currentCategory = ref("weeks");

const { data: attendeesData, graphError } = await supabase
  .from("classes")
  .select("date, attendees")
  .order("date", { ascending: true });

const { data: takingData, takingError } = await supabase
  .from("classes")
  .select("date, taking_cash, taking_card")
  .order("date", { ascending: true });
</script>

<template>
  <div>
    <Heading title="Classes" description="Information on class attendance" />

    <main>
      <div class="flex">
        <div class="w-7/12 mr-6">
          <AddLesson />

          <ClassList />
        </div>
        <div class="w-5/12">
          <div>
            <Card class="mb-6">
              <CardContent>
                <BarChart
                  index="date"
                  :data="attendeesData"
                  :categories="['attendees']"
                  :rounded-corners="4"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <LineChart
                  :data="takingData"
                  index="date"
                  :categories="['taking_cash', 'taking_card']"
                  :colors="['blue', 'pink', 'orange', 'red']"
                  :custom-tooltip="ClassChartTooltip"
                />
              </CardContent>
            </Card>
          </div>
          <!-- <Tabs default-value="weeks">
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
              <Card>
                <CardContent>
                  <LineChart
                    :data="data[category]"
                    index="name"
                    :categories="['total']"
                    :colors="[primary]"
                  />
                </CardContent>
              </Card>
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
          </Tabs> -->
        </div>
      </div>
    </main>
  </div>
</template>
