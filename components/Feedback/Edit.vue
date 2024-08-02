<script setup>
const props = defineProps({
  feedback: Object,
});

import { h } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";

const username = ref(props.feedback.feedback_title);
const feedback_status = ref(props.feedback.feedback_status);
const isOpen = ref(false);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const formSchema = toTypedSchema(z.object({}));

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
      toast({
        title: "Error!",
        description: error,
        variant: "destructive",
      });

      isOpen.value = false;
      await delay(1000);
      //   alertMessage.value = "";
      //   newArtistName.value = null;
      //   artistExists.value = false;
    } else {
      toast("Task has been updated", {
        description: username,
      });
      isOpen.value = false;
      await delay(1000);
      //   alertMessage.value = "";
      //   mbid = null;
      //   newArtistName.value = null;
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

        <form @submit.prevent="onSubmit" :validation-schema="formSchema">
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
                    <SelectItem value="to do">
                      <div class="flex items-center">
                        <div
                          class="bg-red-400 rounded-full w-2 h-2 animate-pulse mr-2"
                          :class="statusClass"
                        ></div>
                        To Do
                      </div></SelectItem
                    >
                    <SelectItem value="in progress">
                      <div class="flex items-center">
                        <div
                          class="bg-yellow-400 rounded-full w-2 h-2 animate-pulse mr-2"
                          :class="statusClass"
                        ></div>
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="testing">
                      <div class="flex items-center">
                        <div
                          class="bg-purple-400 rounded-full w-2 h-2 animate-pulse mr-2"
                          :class="statusClass"
                        ></div>
                        Testing
                      </div></SelectItem
                    >
                    <SelectItem value="done">
                      <div class="flex items-center">
                        <div
                          class="bg-green-400 rounded-full w-2 h-2 animate-pulse mr-2"
                          :class="statusClass"
                        ></div>
                        Done
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
    <Toaster />
  </div>
</template>
