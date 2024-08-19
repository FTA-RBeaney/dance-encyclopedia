<script setup>
definePageMeta({
  layout: "classes",
});

import { CirclePlus } from "lucide-vue-next";
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
      <div class="xl:flex">
        <div class="xl:w-7/12 xl:mr-6">
          <div class="flex justify-end">
            <NuxtLink to="/add-lesson"
              ><Button
                ><CirclePlus class="w-3 h-3 mr-2" />Add lesson</Button
              ></NuxtLink
            >
          </div>
          <!-- <AddLesson /> -->

          <ClassList />
        </div>
        <div class="xl:w-5/12 mt-6 xl:mt-0">
          <div class="flex xl:block">
            <Card class="mb-6 w-6/12 xl:w-full mr-6 xl:mr-0">
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
            <Card class="w-6/12 xl:w-full">
              <CardHeader>
                <CardTitle>Takings </CardTitle>
              </CardHeader>
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
