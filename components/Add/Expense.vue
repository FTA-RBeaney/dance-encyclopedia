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

const people = ["Robert", "Rebecca", "Merlyn", "Eddie", "Karen", "Bob"];
const types = ["Transport", "Rent", "Food + Drink"];

const { $toast } = useNuxtApp();
const supabase = useSupabaseClient();

const formSchema = toTypedSchema(
  z.object({
    created_by: z.string().min(2).max(50),
    name: z.string().min(2).max(50),
    amount: z.number(),
    type: z.string().min(2).max(50),
    date: z
      .string()
      .refine((v) => v, { message: "A date of birth is required." }),
  })
);

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {},
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .upsert({
        amount: values.amount,
        type: values.type,
        approved: false,
        date: values.date,
        name: values.name,
        created_by: values.created_by,
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
  <Card>
    <CardHeader>
      <CardTitle>Add an expense</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="sm:max-w-[425px]">
        <form @submit="onSubmit" class="space-y-4">
          <FormField name="date">
            <FormItem class="flex flex-col">
              <FormLabel>Expense date</FormLabel>
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

          <FormField v-slot="{ componentField }" name="created_by">
            <FormItem>
              <FormLabel>Created by</FormLabel>
              <Select v-bind="componentField" v-model="created_by">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(person, i) in people"
                      :key="`person${i}`"
                      :value="person"
                    >
                      <div class="flex items-center">
                        <div
                          class="rounded-full w-2 h-2 animate-pulse mr-2"
                        ></div>
                        {{ person }}
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="amount">
                <FormItem>
                  <FormLabel>Amount</FormLabel>
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
              <FormField v-slot="{ componentField }" name="type">
                <FormItem>
                  <FormLabel>Expense type</FormLabel>
                  <Select v-bind="componentField" v-model="type">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="(type, i) in types"
                          :key="`type${i}`"
                          :value="type"
                        >
                          <div class="flex items-center">
                            <div
                              class="rounded-full w-2 h-2 animate-pulse mr-2"
                            ></div>
                            {{ type }}
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>
            </div>
          </div>

          <div class="">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormDescription> </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div>
            <div class="flex justify-start mt-4">
              <Button type="submit"> Submit </Button>
            </div>
          </div>
        </form>
      </div>
    </CardContent>
  </Card>
</template>
