<script setup>
import { useTimeAgo } from "@vueuse/core";
import { ThumbsUp } from "lucide-vue-next";
import { RealtimeChannel } from "@supabase/supabase-js";
let realtimeChannel = RealtimeChannel;

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const props = defineProps({
  post: Object,
});

const { post } = props;
const isFavourite = ref(false);
const totalLikes = ref();

const postId = post.id;
const favouriteId = supabaseUser.value.id + postId;

const likeThisPost = async () => {
  console.log({
    id: favouriteId,
    user_id: supabaseUser.id,
    comment_id: postId,
  });
  try {
    const { data, error } = await supabase
      .from("likes")
      .upsert({
        id: favouriteId,
        user_id: supabaseUser.value.id,
        comment_id: postId,
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
    console.log("data");
  }
};

const getLikes = async () => {
  const { data: isLiked, error } = await supabase
    .from("likes")
    .select(`*,profiles(*)`)
    .eq("id", favouriteId);

  isFavourite.value = isLiked;

  const { data: numberOfLikes } = await supabase
    .from("likes")
    .select(`*,profiles(*)`, { count: "exact" })
    .eq("comment_id", postId);

  totalLikes.value = numberOfLikes;
};

onMounted(() => {
  realtimeChannel = supabase.channel("public:likes").on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "likes",
    },

    (payload) => getLikes()
  );
  realtimeChannel.subscribe();
});

await getLikes();

onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});
</script>

<template>
  <Card class="mb-6 p-4">
    <div class="flex flex-row px-2 py-3 mx-3">
      <div class="w-auto h-auto rounded-full">
        <img
          class="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
          alt="User avatar"
          :src="post.profiles.avatar_url"
        />
      </div>
      <div class="flex flex-col mb-2 ml-4 mt-1">
        <div class="text-gray-600 text-sm font-semibold">
          {{ post.profiles.first_name }}
        </div>
        <div class="flex w-full mt-1">
          <div class="text-blue-700 font-base text-xs mr-1 cursor-pointer">
            SEO
          </div>
          <div class="text-gray-400 font-thin text-xs">
            • {{ useTimeAgo(post.created_at) }}
          </div>
        </div>
      </div>
    </div>
    <div class="border-b border-gray-100"></div>
    <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
      <div class="text-gray-500 text-sm mb-6 mx-3 px-2">
        {{ post.content }}
      </div>
      <div v-if="post.photos.length > 0" class="flex gap-2">
        <div
          v-for="(photo, i) in post.photos"
          :key="`upload${i}`"
          class="overflow-hidden rounded-xl col-span-3 max-h-[14rem]"
        >
          <img class="h-full w-full object-cover" :src="photo" alt="" />
        </div>
      </div>
    </div>

    <div class="flex justify-start mb-4 border-t border-gray-100">
      <!-- <pre>{{ totalLikes }}</pre> -->
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
            v-for="(avatar, i) in totalLikes"
            :key="`avatar${i}`"
            class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
            :src="avatar.profiles.avatar_url"
            alt=""
          />
        </div>
      </div>
      <!-- <div class="flex justify-end w-full mt-1 pt-2 pr-5">
              <span
                class="transition ease-out duration-300 hover:bg-blue-50 bg-blue-100 w-8 h-8 px-2 py-2 text-center rounded-full text-blue-400 cursor-pointer mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="14px"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  ></path>
                </svg>
              </span>
              <span
                class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
              >
              </span>
            </div> -->
    </div>
  </Card>
</template>
