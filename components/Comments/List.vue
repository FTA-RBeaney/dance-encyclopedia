<template>
  <div class="mx-auto">
    <section
      class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden mt-6 pb-6"
    >
      <div class="flex w-full justify-start items-start">
        <div class="w-3/4 mr-4">
          <div class="flex justify-between items-center mb-6">
            <h2
              class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white"
            >
              Discussion ({{ commentList.length }})
            </h2>
          </div>
          <form @submit.prevent="submitComment" class="mb-6">
            <div
              class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <label for="comment" class="sr-only">Your comment</label>
              <textarea
                id="comment"
                rows="6"
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                v-model="payload"
                required
              ></textarea>
            </div>

            <Button>Post comment</Button>
          </form>
        </div>
      </div>
    </section>
    <section
      class="flex bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex-col overflow-hidden mx-auto max-w-screen-sm mt-6 pb-6"
    >
      <div v-if="commentList.length > 0" class="container px-0 mx-auto">
        <CommentsCommentFacebook
          v-for="(comment, i) in commentList"
          :key="`comment${i}`"
          :comment="comment"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const superbaseUser = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

const payload = ref("");

const commentList = ref([]);

const submitComment = async () => {
  // Define the data you want to post
  const dataToPost = {
    post_id: route.params.slug,
    payload: payload.value,
    email: superbaseUser.value.email,
    // Add more columns and values as needed
  };

  const { data, error } = await supabase.from("comments").upsert([dataToPost]);
  payload.value = null;

  if (error) {
    console.error("Error submitting email:", error.message);
    return;
  }
};

const fetchComments = async () => {
  const { data: comments, error } = await supabase
    .from("comments")
    .select(`*, profiles(*)`)
    .eq("post_id", route.params.slug)
    .order("created_at", { ascending: false });

  commentList.value = comments;
};

const channel = supabase
  .channel("public:comments")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "comments",
    },

    (payload) => fetchComments()
  )
  .subscribe();

await fetchComments();

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>
