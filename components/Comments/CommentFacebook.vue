<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const props = defineProps({
  comment: Object,
});

const date = computed(() =>
  new Date(props.comment.created_at).toLocaleDateString("en-UK", {
    timeZone: "GMT",
  })
);

const numberOfLikes = ref(props.comment.likes);
const isLiked = ref(false);

const likeId = computed(() => user.value.id + props.comment.id);
console.log("haha", likeId.value);
console.log("userid", user.value.id);
console.log("commentid", props.comment.id);

// check likes table to see if current page is a favourite
const { data, error } = await supabase
  .from("likes")
  .select("id")
  .eq("id", likeId.value);

if (data?.length > 0) {
  isLiked.value = true;
}

const addLike = async () => {
  isLiked.value = true;
  numberOfLikes.value = numberOfLikes.value + 1;
  const { data: addLike, error: likeError } = await supabase
    .from("likes")
    .upsert({
      id: likeId.value,
      user_id: user.value.id,
      comment_id: props.comment.id,
    })
    .select();

  console.log(props.comment.id);

  const { data, error } = await supabase
    .from("comments")
    .update({ likes: numberOfLikes.value })
    .eq("id", props.comment.id)
    .select();
};

const removeLike = async () => {
  isLiked.value = false;
  numberOfLikes.value = numberOfLikes.value - 1;

  const { error: likeError } = await supabase
    .from("likes")
    .delete()
    .eq("id", likeId.value);

  if (likeError) {
    console.log(likeError);
  }

  const { data, error } = await supabase
    .from("comments")
    .update({ likes: numberOfLikes.value })
    .eq("id", props.comment.id)
    .select();
};
</script>
<template>
  <div class="flex-col w-full mx-auto sm:px-4 md:px-4">
    <div class="flex flex-row pt-1 md-10">
      <img
        class="object-cover w-12 h-12 border-1 border-gray-300 rounded-full"
        :src="comment.profiles.avatar_url"
        :alt="comment.profiles.first_name"
      />
      <div class="flex-col mt-1">
        <div class="flex items-center flex-1 px-4 font-bold leading-tight">
          {{ comment.profiles.first_name }}
          <span class="ml-2 text-xs font-normal text-gray-500">{{ date }}</span>
        </div>
        <div
          class="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600"
        >
          {{ comment.payload }}
        </div>
        <button class="inline-flex items-center px-1 pt-2 ml-1 flex-column">
          <svg
            class="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"
            viewBox="0 0 95 78"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.58 0c1.53.064 2.88 1.47 2.879 3v11.31c19.841.769 34.384 8.902 41.247 20.464 7.212 12.15 5.505 27.83-6.384 40.273-.987 1.088-2.82 1.274-4.005.405-1.186-.868-1.559-2.67-.814-3.936 4.986-9.075 2.985-18.092-3.13-24.214-5.775-5.78-15.377-8.782-26.914-5.53V53.99c-.01 1.167-.769 2.294-1.848 2.744-1.08.45-2.416.195-3.253-.62L.85 30.119c-1.146-1.124-1.131-3.205.032-4.312L27.389.812c.703-.579 1.49-.703 2.19-.812zm-3.13 9.935L7.297 27.994l19.153 18.84v-7.342c-.002-1.244.856-2.442 2.034-2.844 14.307-4.882 27.323-1.394 35.145 6.437 3.985 3.989 6.581 9.143 7.355 14.715 2.14-6.959 1.157-13.902-2.441-19.964-5.89-9.92-19.251-17.684-39.089-17.684-1.573 0-3.004-1.429-3.004-3V9.936z"
              fill-rule="nonzero"
            />
          </svg>
        </button>
        <button v-if="isLiked" @click="removeLike" class="inline-flex w-5 h-5">
          <IconsThumbBlock />
        </button>
        <button v-else @click="addLike" class="inline-flex w-5 h-5">
          <IconsThumbOutline />
        </button>
      </div>
    </div>
    <hr class="my-2 ml-16 border-gray-200" />
  </div>
</template>
