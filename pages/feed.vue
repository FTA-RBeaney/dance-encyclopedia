<script setup>
definePageMeta({
  pageTransition: {
    name: "slide",
    mode: "out-in",
  },
  layout: "feed",
});

const supabase = useSupabaseClient();
let testingChannel = null;
const allPosts = ref({});

const getPosts = async () => {
  console.log("GETTING POSTS");
  const { data } = await supabase
    .from("posts")
    .select(`*,profiles(*)`)
    .is("parent", null)
    .order("created_at", { ascending: false });

  allPosts.value = data;
};

await getPosts();

onMounted(() => {
  testingChannel = supabase
    .channel("testingChannel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      (payload) => {
        console.log("Change received!", payload);
        getPosts();
      }
    )
    .subscribe();
});

onUnmounted(() => {
  supabase.removeChannel(testingChannel);
});
</script>

<template>
  <div class="m-6 pb-8">
    <Card class="mb-6 p-4">
      <FeedAddPost />
    </Card>

    <!-- <TransitionGroup name="list" tag="ul"> -->
    <ul>
      <li v-for="(post, i) in allPosts" :key="`post${i}`">
        <FeedPost :post="post">
          {{ post.content }}
        </FeedPost>
      </li>
    </ul>
    <ul>
      <li v-for="(post, i) in allPosts" :key="`post${i}`">
        <pre>{{ post.content }}</pre>
      </li>
    </ul>
    <!-- </TransitionGroup> -->
  </div>
</template>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
