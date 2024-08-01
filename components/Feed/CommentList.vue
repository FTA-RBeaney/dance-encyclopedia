<script setup>
const props = defineProps({
  comments: Object,
  profiles: Object,
  postId: String,
});

import { useTimeAgo } from "@vueuse/core";
import { RealtimeChannel } from "@supabase/supabase-js";

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const content = ref();
const uploads = ref([]);
const isUploading = ref(false);
const comments = ref(props.comments);

let realtimeChannel = RealtimeChannel;

// Fetch collaborators and get the refresh method provided by useAsyncData
// const { data, refresh: refreshComments } = await useAsyncData(
//   "comments",
//   async () => {
//     try {
//       const { data, error } = await supabase
//         .from("post_comments")
//         .select(`*,profiles(*)`)
//         .eq("parent", props.post.id)
//         .order("created_at", { ascending: true });
//       comments.value = data;
//       if (error) throw error;
//     } catch (error) {
//       alert(error.message);
//     } finally {
//     }
//   }
// );

const postComment = async () => {
  const { data } = await supabase
    .from("post_comments")
    .insert({
      user_id: supabaseUser.value.id,
      content: content.value,
      photos: uploads.value,
      parent: props.postId,
    })
    .select();

  content.value = "";
  uploads.value = [];
};

// onMounted(() => {
//   realtimeChannel = supabase.channel("public:posts").on(
//     "postgres_changes",
//     {
//       event: "*",
//       schema: "public",
//       table: "posts",
//     },

//     () => refreshComments()
//   );
//   realtimeChannel.subscribe();
// });

// onUnmounted(() => {
//   supabase.removeChannel(realtimeChannel);
// });
</script>
<template>
  <div>
    <div v-if="props.comments.length > 0">
      <div class="flex w-full border-t border-gray-100">
        <div class="mt-3 mx-5 flex flex-row text-xs">
          <div
            class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center"
          >
            Comments:
            <div class="ml-1 text-gray-400 text-ms">{{ comments?.length }}</div>
          </div>
        </div>
        <!-- <div class="mt-3 mx-5 w-full flex justify-end text-xs">
        <div class="flex text-gray-700 rounded-md mb-2 mr-4 items-center">
          Likes:
          <div class="ml-1 text-gray-400 text-ms">{{ totalLikes.length }}</div>
        </div>
      </div> -->
      </div>
      <!-- 
    <FeedComment
      v-for="(comment, i) in allComments"
      :key="`comment${i}`"
      :comment="comment"
    /> -->

      <!-- comment listing section -->
      <div v-for="(comment, i) in props.comments" :key="`comment${i}`">
        <FeedComment :comment="comment" :profiles="profiles" />
      </div>
    </div>
    <div v-else></div>
    <!-- add comment section -->
    <div
      class="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400"
    >
      <img
        class="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
        alt="User avatar"
        :src="supabaseUser?.user_metadata.avatar_url"
      />
      <span class="absolute inset-y-0 right-0 flex items-center pr-6">
        <button
          type="submit"
          class="p-1 focus:outline-none focus:shadow-none hover:text-blue-500"
        >
          <svg
            class="w-6 h-6 transition ease-out duration-300 hover:text-blue-500 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </span>
      <form @submit.prevent="postComment" class="w-full">
        <input
          type="search"
          class="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
          style="border-radius: 25px"
          placeholder="Post a comment..."
          autocomplete="off"
          v-model="content"
        />
      </form>
    </div>
  </div>
</template>
