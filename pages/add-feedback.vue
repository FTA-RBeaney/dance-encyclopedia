<script setup>
import * as z from "zod";
import { toast } from "@/components/ui/toast";

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

// const feedbackList = ref();
const inProgressList = ref([]);
const inTestingList = ref([]);
const doneList = ref();

let channel;

import tasks from "./../components/DataTable/tasks.json";
import { columns } from "./../components/DataTable/columns";

const { data, refresh } = await useAsyncData("feedback", async () => {
  const { data: feedback } = await supabase
    .from("feedback")
    .select(`*,profiles(*)`)
    .neq("status", "done")
    .order("status", { ascending: false });

  const { data: done } = await supabase
    .from("feedback")
    .select(`*,profiles(*)`)
    .eq("status", "done")
    .order("created_at");

  return { feedback: feedback, done: done };
});

const feedbackList = computed(() => data);

console.log(feedbackList.value);

// try {
//   const { data } = await supabase
//     .from("feedback")
//     .select(`*,profiles(*)`)
//     .eq("feedback_status", "to do")
//     .order("created_at");
//   feedbackList.value = data;

//   const { data: inProgress } = await supabase
//     .from("feedback")
//     .select(`*,profiles(*)`)
//     .eq("feedback_status", "in progress")
//     .order("created_at");

//   const { data: testing } = await supabase
//     .from("feedback")
//     .select(`*,profiles(*)`)
//     .eq("feedback_status", "testing")
//     .order("created_at");

//   inProgressList.value = inProgress;
//   inTestingList.value = testing;
//   doneList.value = done;
// } catch (error) {
//   alert(error.message);
// } finally {
// }

const { data: todo } = await supabase
  .from("feedback")
  .select(`*,profiles(*)`)
  .eq("status", "to do")
  .order("created_at");

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
    }
  } catch (error) {
    console.log("EXISTS", error);
  }
};

onMounted(() => {
  channel = supabase
    .channel("public:feedback")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "feedback",
      },

      () => refresh()
    )
    .subscribe();
});

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>

<template>
  <div>
    <Heading title="Feedback" description="View the feedback so far below" />
    <div class="mt-6">
      <!-- <Card
        class="xl:w-4/12 mx-auto xl:mx-0 xl:mr-6 xl:mb-0 p-6 mb-6 flex justify-center"
      >
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
      </Card> -->
      <div class="mx-auto xl:mx-0">
        <Card class="p-6">
          <DataTable
            :data="feedbackList.value.feedback"
            :columns="columns"
            on-delete="onDelete"
          />
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" class="border-none">
              <AccordionTrigger
                ><p class="py-2 text-lg font-semibold mt-8">
                  Done
                </p></AccordionTrigger
              >
              <AccordionContent>
                <DataTable
                  :data="feedbackList.value.done"
                  :columns="columns"
                  class="mt-4"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <!-- <FeedbackTable :data="feedbackList" title="To Do" />
        <FeedbackTable :data="inProgressList" title="In Progress" />
        <FeedbackTable :data="inTestingList" title="Testing" />
        <FeedbackTable :data="doneList" title="Done" /> -->
        <!-- <p class="py-2 text-lg font-semibold">To Do</p>
        <Card class="p-6">
          <Table v-if="feedbackList">
            <TableHeader>
              <TableRow>
                <TableHead class="font-bold"> Bug </TableHead>
                <TableHead class="font-bold"> Created by </TableHead>
                <TableHead class="font-bold"> Created at</TableHead>
                <TableHead class="font-bold"> Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <FeedbackRow
                :item="item"
                v-for="(item, index) in feedbackList"
                :key="`item${index}`"
              />
            </TableBody>
          </Table>
          <p v-else>No bugs yet!</p>
        </Card> -->
      </div>
    </div>
    <Toaster />
  </div>
</template>
