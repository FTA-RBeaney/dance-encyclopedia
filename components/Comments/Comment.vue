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
  <!-- <div
    class="border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-full h-full flex flex-col overflow-hidden mx-auto"
    :data-id="comment.id"
  >
    <div class="flex items-center space-x-2">
      <div class="flex flex-shrink-0 self-start cursor-pointer">
        <img
          :src="comment.profiles.avatar_url"
          :alt="comment.profiles.first_name"
          class="h-8 w-8 object-fill rounded-full"
        />
      </div>

      <div class="flex items-center justify-center space-x-2 mb-4">
        <div class="block">
          <div class="bg-gray-100 w-auto rounded-xl px-3 pb-2">
            <div class="font-medium">
              <a href="#" class="hover:underline text-md">
                <small>{{ comment.profiles.first_name }}</small>
              </a>
            </div>
            <div class="text-sm">
              {{ comment.payload }}
            </div>
          </div>
          <div class="flex justify-start items-center text-xs w-full">
            <div
              class="font-semibold text-gray-700 px-2 flex items-center justify-center space-x-1"
            >
              <div class="ml-1 mt-2">
                <button
                  v-if="isLiked"
                  @click="removeLike"
                  class="inline-flex w-5 h-5"
                >
                  <IconsThumbBlock />
                </button>
                <button v-else @click="addLike" class="inline-flex w-5 h-5">
                  <IconsThumbOutline />
                </button>
              </div>

              <small class="self-center">.</small>
              <a href="#" class="hover:underline"> {{ date }} </a>
            </div>
          </div>
        </div>
      </div>

      <div
        class="self-stretch flex justify-center items-center transform transition-opacity duration-200 opacity-0 translate -translate-y-2 hover:opacity-100"
      >
        <a href="#" class="">
          <div
            class="text-xs cursor-pointer flex h-6 w-6 transform transition-colors duration-200 hover:bg-gray-100 rounded-full items-center justify-center"
          >
            <svg
              class="w-4 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </div>
        </a>
      </div>
    </div>
  </div> -->

  <article class="p-6 py-6 text-base bg-white rounded-lg dark:bg-gray-900">
    <footer class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <p
          class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"
        >
          <img
            class="mr-2 w-6 h-6 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
            alt="Michael Gough"
          />{{ comment.profiles.first_name }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <time pubdate datetime="2022-02-08" title="February 8th, 2022">{{
            date
          }}</time>
        </p>
      </div>
      <button
        id="dropdownComment1Button"
        data-dropdown-toggle="dropdownComment1"
        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
      >
        <svg
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 3"
        >
          <path
            d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
          />
        </svg>
        <span class="sr-only">Comment settings</span>
      </button>
      <div
        id="dropdownComment1"
        class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul
          class="py-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconHorizontalButton"
        >
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >Edit</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >Remove</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >Report</a
            >
          </li>
        </ul>
      </div>
    </footer>
    <p class="text-gray-500 dark:text-gray-400">
      {{ comment.payload }}
    </p>
    <div class="flex items-center mt-4 space-x-4">
      <button
        type="button"
        class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
      >
        <svg
          class="mr-1.5 w-3.5 h-3.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 18"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
          />
        </svg>
        Reply
      </button>
    </div>
  </article>
</template>
