<script setup>
// definePageMeta({
//   layout: "feed",
// });
definePageMeta({
  pageTransition: {
    name: "slide",
    mode: "out-in",
  },
  layout: "custom",
});

import { AlertCircle } from "lucide-vue-next";
import { RealtimeChannel } from "@supabase/supabase-js";
let realtimeChannel = RealtimeChannel;

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const content = ref();
const uploads = ref([]);
const refreshKey = ref(1);

const createPost = async (post) => {
  const { data } = await supabase
    .from("posts")
    .insert({
      user_id: supabaseUser.value.id,
      content: post.content.value,
      photos: post.uploads.value,
    })
    .select();

  content.value = "";
  uploads.value = [];
};

const showHideSpinner = ref(true);

onBeforeMount(() => {
  showHideSpinner.value = true;
});
onMounted(() => {
  showHideSpinner.value = false;
});
</script>

<template>
  <div class="grid grid-cols-12">
    <div class="m-6 xl:pb-8 col-span-6">
      <Alert variant="note" class="mb-6">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Feel free to post messages below and test out adding photos to the
          posts. And remember to keep it PG!
        </AlertDescription>
      </Alert>

      <FeedAddPost
        @create-post="createPost"
        :content="content"
        :uploads="uploads"
      />

      <LoadingCircle v-if="showHideSpinner" />
      <FeedList v-else :key="refreshKey" />
    </div>
    <div class="lg:w-4/12 lg:pr-4 m-6 lg:mx-0 col-span-5">
      <Card class="p-4">
        <UserList class="px-2" />
      </Card>
    </div>
  </div>
</template>
