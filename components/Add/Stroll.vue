<template>
  <div class="space-y-6 mt-6">
    <div>
      <h3 class="text-lg font-medium">Add a stroll</h3>
      <p class="text-sm text-muted-foreground">Add a stroll to the site.</p>
    </div>
    <Separator />
    <form @submit.prevent="onSubmit" class="space-y-8">
      <FormField v-slot="{ componentField }" name="strollName">
        <FormItem>
          <FormLabel>Stroll name</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="ie. The Shim Sham"
              v-bind="componentField"
            />
          </FormControl>
          <FormDescription> Be accurate with this. </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="videoUrl">
        <FormItem>
          <FormLabel>YouTube URL</FormLabel>
          <FormControl>
            <Input type="text" placeholder="ie." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField name="items">
        <FormItem>
          <FormField
            v-for="item in items"
            v-slot="{ value, handleChange }"
            :key="item.id"
            type="checkbox"
            :value="item.id"
            :unchecked-value="false"
            name="items"
          >
            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  :checked="value.includes(item.id)"
                  @update:checked="handleChange"
                />
              </FormControl>
              <FormLabel class="font-normal">
                {{ item.name }}
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
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "vue-sonner";

const supabase = useSupabaseClient();

const { data: items } = await supabase
  .from("dancers")
  .select()
  .eq("published", true)
  .order("name");

const formSchema = toTypedSchema(
  z.object({
    strollName: z.string().min(2).max(50),
    videoUrl: z.string().min(2).max(50),
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    items: [],
  },
});

const onSubmit = handleSubmit((values) => {
  toast({
    title: "You submitted the following values:",
    description: h(
      "pre",
      { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
      h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
    ),
  });
});
</script>
