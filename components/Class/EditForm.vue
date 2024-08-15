<script setup>
import { h } from "vue";
import { Pencil, Calendar as CalendarIcon } from "lucide-vue-next";
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
import { toDate, parseStringToDateValue } from "radix-vue/date";

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
];

const props = defineProps({
  lesson: Object,
});

const { $toast } = useNuxtApp();
const supabase = useSupabaseClient();

const { data } = await supabase
  .from("classes")
  .select("teachers")
  .eq("id", props.lesson.id)
  .single();

const formSchema = toTypedSchema(
  z.object({
    teachers: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    theme: z.string().min(2).max(50),
    attendees: z.number(),
    taking_card: z.number(),
    taking_cash: z.number(),
    date: z
      .string()
      .date()
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
    date: props.lesson.date,
    attendees: props.lesson.attendees,
    teachers: initialTeachers.value,
    theme: props.lesson.class_theme,
    taking_card: props.lesson.taking_card,
    taking_cash: props.lesson.taking_cash,
  },
});

console.log("props.lesson.date", props.lesson.date);

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

    isOpen.value = false;

    reloadNuxtApp();

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
  }
});

// const date = ref(parseDate(props.lesson.date));

const date = computed(() => props.lesson.date.split("-").reverse().join("-"));
const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button class="text-xs"><Pencil class="w-3 h-3" /></Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit {{ date }}</DialogTitle>
        <DialogDescription>
          Make changes to your lesson here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <!-- <FormField name="date">
          <FormItem class="flex flex-col">
            <FormLabel>Date of lesson</FormLabel> -->
        <!-- <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{
                    date
                      ? df.format(date.toDate(getLocalTimeZone()))
                      : "Pick a date"
                  }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="date" initial-focus />
              </PopoverContent>
            </Popover> -->
        <!-- <Input type="text" v-model="date" disabled class="text-black" /> -->
        <!-- <Label>{{ parseDate(props.lesson.date) }}</Label> -->
        <!-- <FormMessage />
          </FormItem>
        </FormField> -->
        <FormField v-slot="{ componentField }" name="theme">
          <FormItem>
            <div>
              <FormLabel> Class theme </FormLabel>
              <FormDescription>
                This was the theme of the lesson
              </FormDescription>
            </div>
            <FormControl>
              <Input type="text" placeholder="shadcn" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="attendees">
          <FormItem>
            <FormLabel>Attendees</FormLabel>
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

        <FormField name="teachers">
          <FormItem>
            <div class="mb-4">
              <FormLabel class="text-base"> Teachers </FormLabel>
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
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
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

        <div class="flex justify-start mt-4">
          <Button type="submit"> Submit </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
