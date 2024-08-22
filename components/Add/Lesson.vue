<script setup>
import { h } from "vue";
import { CirclePlus, Calendar as CalendarIcon } from "lucide-vue-next";
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { toDate } from "radix-vue/date";

const route = useRoute();

const teachers = [
  {
    id: "rob",
    label: "Rob",
  },
  {
    id: "rebecca",
    label: "Rebecca",
  },
  {
    id: "kibble",
    label: "Kibble",
  },
  {
    id: "spoon",
    label: "Spoon",
  },
];

const { $toast } = useNuxtApp();
const supabase = useSupabaseClient();

const formSchema = toTypedSchema(
  z.object({
    teachers: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    theme: z.string().min(2).max(50),
    attendees: z.number(),
    taking_cash: z.number(),
    taking_card: z.number(),
    date: z
      .string()
      .refine((v) => v, { message: "A date of birth is required." }),
  })
);

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const initialTeachers = computed(() =>
  data.teachers.map((teacher) => {
    return teacher;
  })
);

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    teachers: [],
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data, error } = await supabase
      .from("classes")
      .upsert(
        {
          attendees: values.attendees,
          taking_cash: values.taking_cash,
          taking_card: values.taking_card,
          date: values.date,
          class_theme: values.theme,
          teachers: values.teachers,
          rent: values.rent,
        },
        { onConflict: "date" }
      )
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
    handleRefresh();
  }
});

const emit = defineEmits(["refreshData"]);
const handleRefresh = () => {
  emit("refreshData");
};

const date = ref(new Date().toLocaleDateString("en-GB"));
import addDays from "date-fns/addDays";
const markers = ref([
  {
    date: addDays(new Date(), 2),
    type: "line",
    color: "yellow",
    tooltip: [{ text: "Second tooltip", color: "yellow" }],
  },
]);
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Add a lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="sm:max-w-[425px]">
          <form @submit="onSubmit" class="space-y-4">
            <FormField name="date">
              <FormItem class="flex flex-col">
                <FormLabel>Lesson date</FormLabel>
                <div class="col-span-6 sm:col-span-3">
                  <VueDatePicker
                    :placeholder="date"
                    v-model="date"
                    model-type="yyyy-MM-dd"
                    :enable-time-picker="false"
                    auto-apply
                    :model-value="date"
                    :markers="markers"
                    @update:model-value="
                      (v) => {
                        if (v) {
                          setFieldValue('date', v.toString());
                        } else {
                          setFieldValue('date', undefined);
                        }
                      }
                    "
                  ></VueDatePicker>
                </div>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="theme">
              <FormItem>
                <div>
                  <FormLabel> Class theme </FormLabel>
                  <FormDescription>
                    This was the theme of the lesson
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="ie. Swing Outs"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="attendees">
                  <FormItem>
                    <FormLabel>Attendees</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormDescription> </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="rent">
                  <FormItem>
                    <FormLabel>Rent</FormLabel>
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

            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="taking_card">
                  <FormItem>
                    <FormLabel>Card takings</FormLabel>
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
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="taking_cash">
                  <FormItem>
                    <FormLabel>Cash takings</FormLabel>
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
                  <FormLabel> Teachers </FormLabel>
                  <FormDescription>
                    Select the teachers who taught the lesson
                  </FormDescription>
                </div>

                <FormField
                  v-for="item in teachers"
                  v-slot="{ value, handleChange }"
                  :key="item.id"
                  type="checkbox"
                  :value="item.id"
                  :unchecked-value="false"
                  name="teachers"
                >
                  <FormItem
                    class="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        :checked="value.includes(item.id)"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormLabel class="font-normal">
                      {{ item.label }}
                    </FormLabel>
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
          </form>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
