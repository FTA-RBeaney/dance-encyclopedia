<script setup>
import { useTimeAgo } from "@vueuse/core";
import { ThumbsUp, Trash2 } from "lucide-vue-next";
import { RealtimeChannel } from "@supabase/supabase-js";

let realtimeChannel = RealtimeChannel;
let realtimeChannelPosts = RealtimeChannel;

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const props = defineProps({
  post: Object,
});

const isFavourite = ref(false);
const totalLikes = ref();
const limit = ref(5);
const content = ref();
const uploads = ref([]);
const isUploading = ref(false);
const allComments = ref();

const computedObj = computed(() =>
  limit.value ? totalLikes.value.slice(0, limit.value) : totalLikes.value
);

const timeAgo = useTimeAgo(props.post.created_at);

const postId = props.post.id;
const favouriteId = supabaseUser.value.id + postId;

console.log("postId", postId);

const getComments = async () => {
  const { data } = await supabase
    .from("posts")
    .select(`*,profiles(*)`)
    .eq("parent", postId)
    .order("created_at", { ascending: true });

  allComments.value = data;
};

const likeThisPost = async () => {
  try {
    const { data, error } = await supabase
      .from("likes")
      .upsert({
        id: favouriteId,
        user_id: supabaseUser.value.id,
        comment_id: postId,
        parent: postId,
      })
      .select();

    if (error) {
      console.log(`${error.details} ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.log("error", error);
    alert(error.message);
  } finally {
  }
};

const getLikes = async () => {
  const { data: isLiked, error } = await supabase
    .from("likes")
    .select(`*,profiles(*)`)
    .eq("id", favouriteId);

  console.log("isLiked", isLiked);

  if (isLiked.length > 0) {
    isFavourite.value = true;
  }

  const { data: numberOfLikes } = await supabase
    .from("likes")
    .select(`*,profiles(*)`, { count: "exact" })
    .eq("comment_id", postId);

  totalLikes.value = numberOfLikes;
};

const postComment = async () => {
  const { data } = await supabase
    .from("posts")
    .insert({
      author: supabaseUser.value.id,
      content: content.value,
      photos: uploads.value,
      parent: postId,
    })
    .select();

  content.value = "";
  uploads.value = [];
};

onMounted(() => {
  realtimeChannel = supabase.channel("public:likes").on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "likes",
    },

    () => getLikes()
  );
  realtimeChannel.subscribe();

  realtimeChannelPosts = supabase.channel("public:comments").on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "posts",
    },

    () => getComments()
  );
  realtimeChannelPosts.subscribe();
});

await getLikes();
await getComments();

onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
  supabase.removeChannel(realtimeChannelPosts);
});
</script>

<template>
  <Card v-if="props.post" class="mb-6 p-4">
    <div class="flex flex-row justify-between px-2 py-3 mx-3">
      <div class="flex">
        <div class="w-auto h-auto rounded-full">
          <img
            class="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
            alt="User avatar"
            :src="props.post.profiles.avatar_url"
          />
        </div>
        <div class="flex flex-col mb-2 ml-4 mt-1">
          <div class="text-gray-600 text-sm font-semibold">
            {{ props.post.profiles.first_name }}
          </div>
          <div class="flex w-full mt-1">
            <div class="text-blue-700 font-base text-xs mr-1 cursor-pointer">
              SEO
            </div>
            <div class="text-gray-400 font-thin text-xs">• {{ timeAgo }}</div>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost">
            <button className="text-gray-400 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </button>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-44">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive">
            <Trash2 class="mr-2 h-4 w-4" />
            <span>Delete</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="border-b border-gray-100"></div>
    <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
      <div class="text-black text-sm mb-6 mx-3">
        <slot />
      </div>
      <div v-if="props.post.photos.length > 0" class="flex gap-2">
        <div
          v-for="(photo, i) in props.post.photos"
          :key="`upload${i}`"
          class="overflow-hidden rounded-xl col-span-3 max-h-[14rem]"
        >
          <img class="h-full w-full object-cover" :src="photo" alt="" />
        </div>
      </div>
    </div>

    <div class="flex justify-start mb-4 border-t border-gray-100">
      <div class="flex items-center w-full mt-1 pt-2 pl-5">
        <Button
          @click="likeThisPost"
          variant="ghost"
          class="flex items-center bg-white transition ease-out duration-300 hover:text-red-500 px-2 pt-2 text-center cursor-pointer mr-2"
        >
          <ThumbsUp
            class="w-4 h-4 mr-2"
            :class="isFavourite && 'stroke-black fill-black'"
          />
          {{ totalLikes.length }}
        </Button>
        <div v-if="totalLikes.length > 0">
          <img
            v-for="(avatar, i) in totalLikes.slice(0, limit)"
            :key="`avatar${i}`"
            class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
            :src="avatar.profiles.avatar_url"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="flex w-full border-t border-gray-100">
      <div class="mt-3 mx-5 flex flex-row text-xs">
        <div
          class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center"
        >
          Comments:
          <div class="ml-1 text-gray-400 text-ms">{{ allComments.length }}</div>
        </div>
      </div>
      <div class="mt-3 mx-5 w-full flex justify-end text-xs">
        <div class="flex text-gray-700 rounded-md mb-2 mr-4 items-center">
          Likes:
          <div class="ml-1 text-gray-400 text-ms">{{ totalLikes.length }}</div>
        </div>
      </div>
    </div>

    <FeedComment
      v-for="(comment, i) in allComments"
      :key="`comment${i}`"
      :comment="comment"
    />

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
  </Card>
</template>
