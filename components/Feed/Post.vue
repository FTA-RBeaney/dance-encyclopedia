<script setup>
const props = defineProps({
  post: Object,
});

import { useTimeAgo } from "@vueuse/core";
import { ThumbsUp, Trash2 } from "lucide-vue-next";
import { RealtimeChannel } from "@supabase/supabase-js";

let realtimeChannel = RealtimeChannel;

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const isFavourite = ref(false);
const totalLikes = ref();
const limit = ref(5);
const likes = ref([]);

const computedObj = computed(() =>
  limit.value ? totalLikes.value.slice(0, limit.value) : totalLikes.value
);

const timeAgo = useTimeAgo(props.post.created_at);

const postId = props.post.id;
const favouriteId = supabaseUser.value.id + postId;

const likeThisPost = async () => {
  try {
    const { data, error } = await supabase
      .from("likes")
      .upsert({
        id: favouriteId,
        user_id: supabaseUser.value.id,
        post_id: postId,
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

const {
  data: numberOfLikes,
  status,
  refresh: refreshLikes,
} = await useAsyncData("likes", async () => {
  try {
    const { data, error } = await supabase
      .from("likes")
      .select(`*,profiles(*)`)
      .eq("post_id", postId);

    likes.value = data;
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
});

const isLikedByMe = !!likes.value.find(
  (like) => like.user_id === supabaseUser.value.id
);

const deletePost = async (id) => {
  try {
    const { data, error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
  }
};

onMounted(() => {
  realtimeChannel = supabase.channel("public:likes").on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "likes",
    },

    () => {
      refreshLikes();
    }
  );
  realtimeChannel.subscribe();
});

onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});
</script>

<template>
  <Card class="mb-6 p-4">
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
          <DropdownMenuItem
            @click="deletePost(props.post.id)"
            class="text-destructive"
          >
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
      <div v-if="props?.post?.photos?.length > 0" class="flex gap-2">
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
            :class="isLikedByMe && 'stroke-black fill-black'"
          />
          {{ likes?.length }}
        </Button>
        <div v-if="likes?.length > 0">
          <img
            v-for="(avatar, i) in likes.slice(0, limit)"
            :key="`avatar${i}`"
            class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
            :src="avatar.profiles.avatar_url"
            alt=""
          />
        </div>
      </div>
    </div>
    <FeedCommentList :post="props.post" />
  </Card>
</template>
