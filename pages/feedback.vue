<script setup>
// import { toast } from "@/components/ui/toast";

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

let channel;
import { columns } from "../components/DataTable/columns";

const { data, refresh } = await useAsyncData(
  "feedbackAllFeedback",
  async () => {
    const { data: all } = await supabase
      .from("feedback")
      .select(`*,profiles(*)`)
      .order("status", { ascending: false });

    const { data: feedback } = await supabase
      .from("feedback")
      .select(`*,profiles(*)`)
      .eq("status", "to do")
      .order("status", { ascending: false });

    const { data: done } = await supabase
      .from("feedback")
      .select(`*,profiles(*)`)
      .eq("status", "done")
      .order("created_at");

    const { data: inProgress } = await supabase
      .from("feedback")
      .select(`*,profiles(*)`)
      .eq("status", "in progress")
      .order("created_at");

    const { data: testing } = await supabase
      .from("feedback")
      .select(`*,profiles(*)`)
      .eq("status", "testing")
      .order("created_at");

    return {
      all: all,
      feedback: feedback,
      done: done,
      inProgress: inProgress,
      testing: testing,
    };
  }
);

const feedbackList = computed(() => data);

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

    <div>
      <Card class="p-6 mt-4 mr-4">
        <p class="pb-2 text-lg font-semibold">To Do</p>
        <DataTable
          :data="feedbackList.value.all"
          :columns="columns"
          class="mt-4"
        />
      </Card>
    </div>

    <!-- <div class="mt-6">
      <div class="mx-auto xl:mx-0">
        <div class="flex">
          <Card class="p-6 mt-8 mr-4 max-w-[50%]">
            <p class="pb-2 text-lg font-semibold">To Do</p>
            <DataTable
              :data="feedbackList.value.feedback"
              :columns="columns"
              on-delete="onDelete"
              class="mt-4"
            />
          </Card>

          <Card
            class="p-6 mt-8 mr-4 max-w-[50%]"
            v-if="feedbackList.value.inProgress.length > 0"
          >
            <p class="pb-2 text-lg font-semibold">In Progress</p>
            <DataTable
              :data="feedbackList.value.inProgress"
              :columns="columns"
              on-delete="onDelete"
              class="mt-4"
            />
          </Card>

          <Card
            class="p-6 mt-8 mr-4 max-w-[50%]"
            v-if="feedbackList.value.testing.length > 0"
          >
            <p class="pb-2 text-lg font-semibold">Testing</p>
            <DataTable
              :data="feedbackList.value.testing"
              :columns="columns"
              on-delete="onDelete"
            />
          </Card>
        </div>
        <div class="flex">
          <Card class="p-6 mt-8 w-full">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" class="border-none">
                <AccordionTrigger
                  ><p class="text-lg font-semibold">Done</p></AccordionTrigger
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
        </div>
      </div>
    </div> -->
  </div>
</template>
