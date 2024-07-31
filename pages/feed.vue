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

  refreshKey.value += 1;
  // reloadNuxtApp();
};

onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = supabase
    .channel("public:posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      () => (refreshKey.value += 1)
    );

  realtimeChannel.subscribe();
});

// Don't forget to unsubscribe when user left the page
onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});
</script>

<template>
  <div class="m-6 pb-8">
    <FeedAddPost
      @create-post="createPost"
      :content="content"
      :uploads="uploads"
    />

    <FeedList :key="refreshKey" />
  </div>
</template>
