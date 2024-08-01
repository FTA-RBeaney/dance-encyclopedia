<script setup>
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { MessageSquare } from "lucide-vue-next";

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const feedbackList = ref([]);
const isOpen = ref(false);

const getFeedback = async () => {
  const { data: feedback } = await supabase
    .from("feedback")
    .select("*", { count: "exact" });

  feedbackList.value = feedback;
};
const schema = z.object({
  typeOfFeedback: z.nativeEnum([
    "🐛 Bug",
    "💡 Idea",
    "🛠️ Functionality",
    "❓ Other",
  ]),

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
        type: values.typeOfFeedback,
        feedback: values.feedbackDescription,
        feedback_title: values.feedbackTitle,
      })
      .select();

    if (data === null) {
      toast({
        title: "Error!",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your feedback has been received.",
        variant: "success",
      });
      isOpen.value = false;
    }
  } catch (error) {
    console.log("EXISTS", error);
  }
};

const channel = supabase
  .channel("public:feedback")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "feedback",
    },

    (payload) => getFeedback()
  )
  .subscribe();

await getFeedback();

const getIsExpanded = ref(true);

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>

<template>
  <div>
    <Dialog v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button class="relative"
          ><MessageSquare class="w-4 h-4 mr-2" /> Add feedback/bug
          <div
            class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
          >
            {{ feedbackList.length }}
          </div>
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
            feedbackDescription: {
              component: 'textarea',
            },
          }"
          @submit="onSubmit"
        >
          <Button type="submit"> Submit </Button>
        </AutoForm>
      </DialogContent>
    </Dialog>
    <Toaster />
  </div>
</template>
