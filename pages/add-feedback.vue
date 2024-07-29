<script setup>
import * as z from "zod";
import { toast } from "@/components/ui/toast";

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const feedbackList = ref([]);

const getFeedback = async () => {
  const { data } = await supabase
    .from("feedback")
    .select(`*,profiles(*)`)
    .order("created_at");
  feedbackList.value = data;
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
    console.log(values);
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
      getFeedback();
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
  <div class="flex">
    <Card class="w-4/12 p-6 flex justify-center">
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
    </Card>
    <Card class="w-8/12 p-6 ml-4">
      <Table v-if="feedbackList">
        <TableHeader>
          <TableRow>
            <TableHead class="font-bold"> Bug </TableHead>
            <TableHead class="font-bold"> Created by </TableHead>
            <TableHead class="font-bold"> Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-for="(item, index) in feedbackList" :key="`item${index}`">
            <FeedbackRow :item="item" />
          </template>
        </TableBody>
      </Table>
      <p v-else>No bugs yet!</p>
    </Card>
    <Toaster />
  </div>
</template>
