<script setup>
definePageMeta({
  layout: "feed",
});

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

  // refreshKey.value += 1;
  // reloadNuxtApp();
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
  <div class="m-6 pb-8">
    <FeedAddPost
      @create-post="createPost"
      :content="content"
      :uploads="uploads"
    />

    <LoadingCircle v-if="showHideSpinner" />
    <FeedList v-else :key="refreshKey" />
  </div>
</template>
