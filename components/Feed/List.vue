<script setup>
import { RealtimeChannel } from "@supabase/supabase-js";
let realtimeChannel = RealtimeChannel;
const supabase = useSupabaseClient();

const posts = ref([]);

// Fetch collaborators and get the refresh method provided by useAsyncData
const { data, refresh } = await useAsyncData("posts", async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`*,profiles(*),post_comments(*)`)
      .is("parent", null)
      .order("created_at", { ascending: false });
    posts.value = data;

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
});

// Once page is mounted, listen to changes on the `collaborators` table and refresh collaborators when receiving event
// onMounted(() => {
//   // Real time listener for new workouts
//   realtimeChannel = supabase
//     .channel("public:posts")
//     .on(
//       "postgres_changes",
//       { event: "*", schema: "public", table: "posts" },
//       () => refreshPosts()
//     );

//   realtimeChannel.subscribe();
// });

// // Don't forget to unsubscribe when user left the page
// onUnmounted(() => {
//   supabase.removeChannel(realtimeChannel);
// });

onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = supabase
    .channel("public:posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      () => reloadNuxtApp()
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "post_comments",
      },

      () => refresh()
    );

  realtimeChannel.subscribe();
});

// Don't forget to unsubscribe when user left the page
onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});
</script>

<template>
  <div>
    <div v-for="(post, i) in posts" :key="`post${i}`">
      <FeedPost :post="post" />
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
