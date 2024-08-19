<script setup>
const supabase = useSupabaseClient();
import _groupBy from "lodash/groupBy";

const { data: classData, error } = await supabase
  .from("classes")
  .select()
  .order("date", { ascending: false });

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const months = _groupBy(classData, ({ date }) => new Date(date).getMonth());

const totalTakings = computed(
  () => classData.taking_cash + classData.taking_card
);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// var firstItem = months.splice(0, 1)[0];

let [firstKey] = Object.keys(months);

console.log(firstKey);
</script>

<template>
  <div>
    <!-- <pre>{{ classData }}</pre> -->
    <Tabs :default-value="monthNames[firstKey]">
      <TabsList>
        <TabsTrigger
          :value="monthNames[i]"
          v-for="(month, i) in months"
          :key="i"
        >
          {{ monthNames[i] }}
        </TabsTrigger>
      </TabsList>

      <TabsContent v-for="(month, i) in months" :key="i" :value="monthNames[i]">
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Attendees</TableHead>
                  <!-- <TableHead>Card</TableHead>
                  <TableHead>Cash</TableHead> -->
                  <TableHead>Total Takings</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Class Theme</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(week, i) in month" :key="`week${i}`">
                  <TableCell>
                    {{ week.date.split("-").reverse().join("-") }}
                  </TableCell>
                  <TableCell>
                    {{ week.attendees }}
                  </TableCell>
                  <!-- <TableCell> £{{ week.taking_card }} </TableCell>
                  <TableCell> £{{ week.taking_cash }} </TableCell> -->
                  <TableCell>
                    £{{ week.taking_card + week.taking_cash }}
                  </TableCell>
                  <TableCell>
                    <span
                      v-for="(teacher, i) in week.teachers"
                      :key="`teacher${i}`"
                      class="mr-2"
                    >
                      <span
                        class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300"
                        >{{ capitalizeFirstLetter(teacher) }}</span
                      >
                    </span>
                  </TableCell>
                  <TableCell>
                    {{ week.class_theme }}
                  </TableCell>
                  <TableCell>
                    <div class="flex">
                      <ClassSummary :lesson="week" />
                      <ClassEditForm :lesson="week" />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    <!-- <ul v-for="(month, i) in months">
      <pre>{{ monthNames[i] }}</pre>
      <li v-for="week in month">
        <pre>{{ week }}</pre>
      </li>
    </ul> -->
    <!-- <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Attendees</TableHead>
          <TableHead>Card</TableHead>
          <TableHead>Cash</TableHead>
          <TableHead>Total Takings</TableHead>
          <TableHead>Teachers</TableHead>
          <TableHead>Class Theme</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ClassListRow
          v-for="(lesson, i) in classData"
          :key="`class${i}`"
          :lesson="lesson"
        />
      </TableBody>
    </Table> -->
  </div>
</template>
