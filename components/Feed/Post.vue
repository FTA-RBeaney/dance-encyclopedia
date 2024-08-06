<script setup>
const props = defineProps({
  post: Object,
});

import { useTimeAgo } from "@vueuse/core";
import { ThumbsUp, Trash2, MessageSquare } from "lucide-vue-next";
import { RealtimeChannel } from "@supabase/supabase-js";

let realtimeChannel = RealtimeChannel;

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const isFavourite = ref(false);
const totalLikes = ref();
const limit = ref(5);
const likes = ref([]);

const numberOfLikes = computed(() => likes.value.length);

const computedObj = computed(() =>
  limit.value ? totalLikes.value.slice(0, limit.value) : totalLikes.value
);

const timeAgo = useTimeAgo(props.post.created_at);

const postId = props.post.id;
const favouriteId = supabaseUser.value.id + postId;

const isLikedByMe = ref(false);
const isOpen = ref(true);

const toggleComments = () => {
  isOpen.value = !isOpen.value;
};

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
    isLikedByMe.value = true;
    if (error) {
      console.log(`${error.details} ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.log("error", error);
    alert(error.message);
  }
};

const deletePost = async (id) => {
  try {
    const { data, error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  }
};

onMounted(async () => {
  const { data, refresh } = await useAsyncData("likes", async () => {
    try {
      const { data, error } = await supabase
        .from("likes")
        .select(`*,profiles(*)`)
        .eq("post_id", props.post.id);
      likes.value = data;
      isLikedByMe.value = !!likes.value.find(
        (like) => like.user_id === supabaseUser.value.id
      );
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  });

  realtimeChannel = supabase.channel(`likes${props.post.id}`).on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "likes",
    },

    () => {
      refresh();
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
        <div class="w-auto h-auto">
          <img
            class="w-12 h-12 object-cover rounded-md shadow cursor-pointer"
            :alt="props.post.profiles.first_name"
            :src="props.post.profiles.avatar_url"
          />
        </div>
        <div class="flex flex-col mb-2 ml-4 mt-1">
          <div class="text-gray-600 text-sm font-semibold">
            {{ props.post.profiles.first_name }}
          </div>
          <div class="flex w-full mt-1">
            <!-- <div class="text-blue-700 font-base text-xs mr-1 cursor-pointer">
              SEO
            </div> -->
            <div class="text-gray-400 font-thin text-xs">{{ timeAgo }}</div>
          </div>
        </div>
      </div>

      <DropdownMenu v-if="props.post.user_id === supabaseUser.id">
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
    <div class="mb-7 mt-6 mx-3 px-2">
      <div class="fs-6 fw-normal text-primary-700 text-sm mb-5">
        {{ props.post.content }}
      </div>
      <div v-if="props?.post?.photos?.length > 0" class="flex gap-2">
        <div
          v-for="(photo, i) in props.post.photos"
          :key="`upload${i}`"
          class="overflow-hidden rounded-md col-span-3 max-h-[12rem] max-w-[12rem]"
        >
          <Dialog>
            <DialogTrigger v-if="photo">
              <img :src="photo" class="" />
            </DialogTrigger>
            <DialogContent class="w-auto">
              <img
                :src="photo"
                class="h-94 w-fit sm:min-w-[425px] max-h-[75vh] object-cover"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

    <div class="flex justify-start mb-4 border-t border-gray-100">
      <div class="flex items-center w-full mt-1 pt-2 pl-5">
        <Button class="mr-2" variant="ghost" @click="toggleComments"
          ><MessageSquare class="w-4 h-4 mr-2" />{{
            props.post.post_comments.length
          }}
          Comments</Button
        >
        <Button
          @click="likeThisPost"
          variant="ghost"
          class="transition ease-out duration-300 hover:bg-red-500 hover:text-white text-center cursor-pointer mr-2"
          :class="isLikedByMe && 'bg-red-500 text-white'"
        >
          <ThumbsUp
            class="w-4 h-4 mr-2"
            :class="isLikedByMe && ' stroke-white'"
          />
          {{ numberOfLikes }} Likes
        </Button>
        <div v-if="likes?.length > 0">
          <img
            v-for="(avatar, i) in likes.slice(0, limit)"
            :key="`avatar${i}`"
            class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer relative z-10 hover:z-20"
            :class="i > 0 && '-ml-2'"
            :src="avatar.profiles.avatar_url"
            :alt="avatar.profiles.first_name"
          />
        </div>
      </div>
    </div>
    <Transition mode="out-in">
      <FeedCommentList
        v-show="isOpen"
        :profiles="props.post.profiles"
        :comments="props.post.post_comments"
        :postId="props.post.id"
      />
    </Transition>
  </Card>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 500px;
}

.v-enter-from,
.v-leave-to {
  max-height: 0;
  opacity: 0;
  transition: all 0.3s ease;
}
</style>
