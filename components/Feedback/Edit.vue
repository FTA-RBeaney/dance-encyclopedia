<script setup>
const props = defineProps({
  feedback: Object,
});

import { h } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";

const username = ref(props.feedback.feedback_title);
const isOpen = ref(false);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
  })
);

const onSubmit = async (username) => {
  const supabase = useSupabaseClient();

  try {
    const { error } = await supabase
      .from("feedback")
      .update({
        feedback_title: username,
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
    console.log("EXISTS", error);
  }
};
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

        <form
          @submit.prevent="onSubmit(username)"
          :validation-schema="formSchema"
        >
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

          <DialogFooter>
            <Button type="submit" class="mt-4"> Save changes </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <Toaster />
  </div>
</template>
