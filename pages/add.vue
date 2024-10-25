<script setup>
import { h } from "vue";
import _groupBy from "lodash/groupBy";
import ExpensesChartTooltip from "../components/Expenses/ChartTooltip.vue";
import {
  HandCoins,
  CreditCard,
  Calendar as CalendarIcon,
} from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { toDate } from "radix-vue/date";
import TableCell from "../components/ui/table/TableCell.vue";

const { $toast } = useNuxtApp();
const supabase = useSupabaseClient();

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

var options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "GMT",
};

const { handleSubmit, setFieldValue, values, resetForm } = useForm({
  initialValues: {
    date: today(getLocalTimeZone()).toString(),
  },
});

// GET DATA FROM SUPABASE
// get attendee data from classes
const { data: lessonAttendees, refresh: refreshlessonAttendees } =
  await useAsyncData("lessonAttendees", async () => {
    const { data, error } = await supabase
      .from("class_attendance")
      .select("*")
      .order("created_at", { ascending: true });

    return data;
  });

//  get the information on classes (ie. teachers and class theme)
const { data: classData, refresh } = await useAsyncData(
  "getClassInfo",
  async () => {
    const { data, allError } = await supabase.from("classes").select("*");

    return data;
  }
);

// FUNCTIONS
const onSubmit = handleSubmit(async (values, actions) => {
  try {
    const { data, error } = await supabase
      .from("class_attendance")
      .upsert({
        name: values.name,
        donation: values.donation,
        donation_type: values.donation_type,
        date: values.date,
      })
      .select();

    $toast("You submitted the following values:", {
      description: h(
        "pre",
        { class: "mt-2 w-full rounded-md bg-slate-950 p-4" },
        h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
      ),
    });
    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("EXISTS", error);
  } finally {
    refreshlessonAttendees();
    actions.setValues({ name: "", donation: 0, donation_type: null });
    // await navigateTo("/classes");
  }
});

const onDelete = async (id) => {
  try {
    const { data, error } = await supabase
      .from("class_attendance")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    $toast("There was an error", {
      title: "There was an error",
      description: error,
    });
  } finally {
    $toast("Task deleted", {
      description: "Task deleted",
    });
    refreshlessonAttendees();
  }
};

// HELPERS
const createDate = (createdAt) =>
  new Date(createdAt).toLocaleDateString("en-UK", options);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// COMPUTED VALUES
const totalAttendees = computed(() => filteredAttendees.value.length);
const filteredAttendees = computed(() =>
  lessonAttendees.value.filter((lesson) => lesson.date === values.date)
);
const filteredClassInfo = computed(() =>
  classData.value.filter((data) => data.date === values.date)
);

// total the payment types and split them into an array with name and quantity
const totalled = computed(() => {
  const result = _groupBy(
    filteredAttendees.value,
    ({ donation_type }) => donation_type
  );

  var newResult = {
    data: filteredAttendees.value.map(function (item) {
      console.log("item", item);
      return {
        donation_type: item.donation_type,
        donation: item.donation,
      };
    }),
  };

  const finalResult = Object.values(
    newResult.data.reduce((agg, item) => {
      if (agg[item.donation_type] === undefined)
        agg[item.donation_type] = {
          name: capitalizeFirstLetter(item.donation_type),
          sumQuantity: 0,
        };
      agg[item.donation_type].sumQuantity += +item.donation;
      return agg;
    }, {})
  );

  return finalResult;
});

const value = computed({
  get: () => (values.date ? parseDate(values.date) : undefined),
  set: (val) => val,
});
</script>

<template>
  <div>
    <Heading
      title="Lesson tracker"
      description="Add your lesson details below"
    />
    <form @submit="onSubmit" class="space-y-6">
      <div class="flex justify-start gap-6">
        <Card class="w-4/12 max-w-md">
          <CardHeader>
            <CardTitle>Select date:</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField name="date">
              <FormItem class="flex flex-col">
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      class="w-[280px] justify-start text-left font-normal"
                    >
                      <span>{{
                        value ? df.format(toDate(value)) : "Pick a date"
                      }}</span>
                      <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      v-model:placeholder="placeholder"
                      v-model="value"
                      calendar-label="Date of lesson"
                      initial-focus
                      :min-value="new CalendarDate(1900, 1, 1)"
                      :max-value="today(getLocalTimeZone())"
                      @update:model-value="
                        (v) => {
                          if (v) {
                            setFieldValue('date', v.toString());
                          } else {
                            setFieldValue('date', undefined);
                          }
                        }
                      "
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>
      </div>
      <div class="flex items-start gap-6 w-full">
        <Card class="w-4/12 max-w-md">
          <CardHeader>
            <CardTitle>Add attendee</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="sm:max-w-[425px] grid gap-4">
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <div>
                    <FormLabel> Attendee name </FormLabel>
                    <FormDescription> Name of the person </FormDescription>
                  </div>
                  <FormControl>
                    <Input type="text" placeholder="" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <FormField v-slot="{ componentField }" name="donation">
                    <FormItem>
                      <FormLabel>Donation</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          step="0.01"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormDescription> </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
              </div>

              <FormField name="teachers">
                <FormItem>
                  <div class="mb-4">
                    <FormLabel> Donation type </FormLabel>
                    <FormDescription> Select the payment type </FormDescription>
                  </div>

                  <FormField
                    v-slot="{ componentField }"
                    type="radio"
                    name="donation_type"
                  >
                    <FormItem
                      class="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroup
                          class="flex flex-col space-y-1"
                          v-bind="componentField"
                        >
                          <FormItem class="flex items-center space-y-0 gap-x-3">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel class="font-normal"> Cash </FormLabel>
                          </FormItem>
                          <FormItem class="flex items-center space-y-0 gap-x-3">
                            <FormControl>
                              <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel class="font-normal"> Card </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormMessage />
                </FormItem>
              </FormField>

              <div>
                <div class="flex justify-start mt-4">
                  <Button type="submit"> Submit </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="w-8/12">
          <CardHeader>
            <CardTitle>
              <div class="flex justify-between">
                <div>Attendees for {{ createDate(values.date) }}</div>
              </div></CardTitle
            >
          </CardHeader>
          <CardContent>
            <Table v-if="totalAttendees">
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Donation type</TableHead>
                  <TableHead>Donation amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(attendee, i) in filteredAttendees"
                  :key="`attendee${i}`"
                >
                  <TableCell class="py-0">
                    {{ attendee.name }}
                  </TableCell>
                  <TableCell class="py-0">
                    <div class="flex">
                      <HandCoins v-if="attendee.donation_type === 'cash'" />
                      <CreditCard v-if="attendee.donation_type === 'card'" />
                      <span class="ml-2 capitalize">{{
                        attendee.donation_type
                      }}</span>
                    </div>
                  </TableCell>
                  <TableCell class="py-0"> £{{ attendee.donation }} </TableCell>
                  <TableCell class="text-right py-2">
                    <Button
                      variant="destructive"
                      @click.prevent="onDelete(attendee.id)"
                      class="h-8 px-2"
                      >Delete</Button
                    ></TableCell
                  >
                </TableRow>
              </TableBody>
            </Table>
            <h3 v-else>No data for this day</h3>
          </CardContent>
        </Card>
        <Card v-if="totalled.length > 0" class="w-6/12 max-w-lg">
          <CardHeader>
            <CardTitle>Class info</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex gap-6">
              <div class="w-6/12">
                <h3 class="font-bold mb-1">Class theme</h3>
                <div v-if="filteredClassInfo[0]?.class_theme">
                  {{ filteredClassInfo[0].class_theme }}
                </div>
                <div v-else>N/A</div>
              </div>
              <div class="w-6/12">
                <h3 class="font-bold mb-1">Teachers</h3>
                <div v-if="filteredClassInfo[0]?.teachers.length > 0">
                  <span
                    v-for="(teacher, i) in filteredClassInfo[0].teachers"
                    :key="`teacher${i}`"
                    class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300 capitalize"
                    >{{ capitalizeFirstLetter(teacher) }}</span
                  >
                </div>
                <div v-else>N/A</div>
              </div>
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle>Class breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassBreakdown
              :filteredAttendees="filteredAttendees"
              :totalled="totalled"
            />
          </CardContent>
        </Card>
      </div>
    </form>
  </div>
</template>
