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

    <ul>
      <li v-for="(post, i) in allPosts" :key="`post${i}`">
        <FeedPost :post="post">
          {{ post.content }}
        </FeedPost>
      </li>
    </ul>
  </div>
</template>
