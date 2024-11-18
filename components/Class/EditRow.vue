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
import { toDate } from "radix-vue/date";

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
    taking_card: z.string(),
    dob: z
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
    // dob: props.lesson.date,
    teachers: initialTeachers.value,
    theme: props.lesson.class_theme,
    taking_card: props.lesson.taking_card,
  },
});

const onSubmit = handleSubmit(async (values) => {
  console.log("values", values);
  push.success("Class edited");
});

const placeholder = ref();
const value = ref();
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <Table>
      <TableRow>
        <TableCell>
          <FormField name="dob">
            <FormItem class="flex flex-col">
              <Popover>
                <PopoverTrigger as-child>
                  <FormControl>
                    <Button
                      variant="outline"
                      class="w-[140px] ps-3 text-start font-normal"
                    >
                      <span>{{
                        value ? df.format(toDate(value)) : "Pick a date"
                      }}</span>
                      <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                    <input hidden />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    v-model:placeholder="placeholder"
                    v-model="value"
                    calendar-label="Date of birth"
                    initial-focus
                    :min-value="new CalendarDate(1900, 1, 1)"
                    :max-value="today(getLocalTimeZone())"
                    @update:model-value="
                      (v) => {
                        if (v) {
                          setFieldValue('dob', v.toString());
                        } else {
                          setFieldValue('dob', undefined);
                        }
                      }
                    "
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>
        </TableCell>

        <TableCell>
          <FormField v-slot="{ componentField }" name="attendees">
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="0" v-bind="componentField" />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </TableCell>

        <TableCell>
          <FormField v-slot="{ componentField }" name="taking_card">
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="0" v-bind="componentField" />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </TableCell>

        <TableCell>
          <FormField v-slot="{ componentField }" name="taking_cash">
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="0" v-bind="componentField" />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </TableCell>

        <TableCell>
          <FormField v-slot="{ componentField }" name="total">
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="0" v-bind="componentField" />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </TableCell>

        <TableCell>
          <FormField name="teachers">
            <FormItem>
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
        </TableCell>

        <TableCell>
          <FormField v-slot="{ componentField }" name="theme">
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="shadcn"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </TableCell>

        <TableCell>
          <div class="flex justify-start mt-4">
            <Button type="submit" @click="$emit(toggleRow)"> Submit </Button>
          </div>
        </TableCell>
      </TableRow>
    </Table>
  </form>
</template>
