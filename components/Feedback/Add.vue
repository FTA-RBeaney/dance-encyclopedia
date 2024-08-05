<script setup>
import * as z from "zod";
import { MessageSquare } from "lucide-vue-next";
import { toast } from "vue-sonner";

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const feedbackList = ref([]);
const isOpen = ref(false);

const schema = z.object({
  feedbackType: z.nativeEnum(["bug", "feature"]),

  feedbackTitle: z
    .string()
    .min(10, {
      message: "Title must be at least 10 characters.",
    })
    .max(160, {
      message: "Title must not be longer than 160 characters.",
    }),

  feedbackDescription: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(300, {
      message: "Description must not be longer than 300 characters.",
    }),
});

const onSubmit = async (values) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .upsert({
        user_id: supabaseUser.value.id,
        type: values.feedbackType,
        feedback: values.feedbackDescription,
        title: values.feedbackTitle,
        status: "to do",
        priority: "medium",
      })
      .select();

    if (data === null) {
      toast("Error!", {
        description: error,
      });
    } else {
      toast("Success!", {
        description: "Your feedback has been received.",
      });
      isOpen.value = false;
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
        <Button class="relative"
          ><MessageSquare class="w-4 h-4 mr-2" /> Add feedback/bug
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add feedback/bug</DialogTitle>
          <DialogDescription>
            Add your feedback here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <AutoForm
          class="w-full space-y-6"
          :schema="schema"
          :field-config="{
            feedbackType: {
              inputProps: {
                placeholder: 'Choose a feedback type',
              },
            },
            feedbackTitle: {
              inputProps: {
                placeholder: 'Enter a title for the issue',
              },
            },
            feedbackDescription: {
              component: 'textarea',
              inputProps: {
                placeholder:
                  'Enter a description of the issue. Try and be as detailed as possible',
              },
            },
          }"
          @submit="onSubmit"
        >
          <Button type="submit"> Submit </Button>
        </AutoForm>
      </DialogContent>
    </Dialog>
  </div>
</template>
