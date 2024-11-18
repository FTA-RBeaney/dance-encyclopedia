<script setup>
const props = defineProps({
  feedback: Object,
  statuses: Object,
});

import { h } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const username = ref(props.feedback.feedback_title);
const feedback_status = ref(props.feedback.feedback_status);
const isOpen = ref(false);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50).default(username.value),
    feedback_status: z.string().default(feedback_status.value),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const supabase = useSupabaseClient();

  try {
    const { error } = await supabase
      .from("feedback")
      .update({
        feedback_title: values.username,
        feedback_status: values.feedback_status,
      })
      .eq("id", props.feedback.id.value);

    if (error) {
      push.error(error);

      isOpen.value = false;
      await delay(1000);
    } else {
      push.success("Feedback edited");
      isOpen.value = false;
      await delay(1000);
    }
  } catch (error) {
    console.log("CAUGHT ERROR", error);
  }
});
</script>

<template>
  <div>
    <Dialog v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline"> Edit </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit feedback</DialogTitle>
          <DialogDescription>
            Make changes to your feedback here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form @submit="onSubmit" :validation-schema="formSchema">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="shadcn"
                  v-bind="componentField"
                  v-model="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="feedback_status">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select v-bind="componentField" v-model="feedback_status">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(status, i) in props.statuses"
                      :key="`status${i}`"
                      :value="status.value"
                    >
                      <div class="flex items-center">
                        <div
                          class="rounded-full w-2 h-2 animate-pulse mr-2"
                          :class="status.class"
                        ></div>
                        {{ status.label }}
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>

          <DialogFooter>
            <Button type="submit" class="mt-4"> Save changes </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
