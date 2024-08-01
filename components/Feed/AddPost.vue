<script setup>
const props = defineProps({
  content: String,
  uploads: Array,
});
const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const content = ref();
const uploads = ref([]);
const isUploading = ref(false);

const avatar = computed(() => supabaseUser?.value.user_metadata.avatar_url);
const firstName = computed(() => supabaseUser?.value.user_metadata.full_name);

// const createPost = async () => {
//   const { data } = await supabase
//     .from("posts")
//     .insert({
//       user_id: supabaseUser.value.id,
//       content: content.value,
//       photos: uploads.value,
//     })
//     .select();

//   content.value = "";
//   uploads.value = [];
// };

const emit = defineEmits(["createPost"]);
const handleSubmit = () => {
  emit("createPost", { content, uploads });
  content.value = "";
  uploads.value = [];
};

const addPhotos = async (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    isUploading.value = true;

    for (const file of files) {
      const newName = Date.now() + file.name;
      const result = await supabase.storage
        .from("feed_photos")
        .upload(newName, file);
      if (result.data) {
        const url = `https://misyrpoxvyxwrnhnmeww.supabase.co/storage/v1/object/public/feed_photos/${result.data.path}`;
        uploads.value = [...uploads.value, url];
      }
    }
    isUploading.value = false;
  }
};
</script>

<template>
  <Card class="mb-6 p-4">
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-row items-center justify-center px-2 py-3">
        <div class="w-12 h-12 min-w-12 rounded-full">
          <img
            class="w-full h-full object-cover rounded-full shadow cursor-pointer"
            alt="User avatar"
            :src="avatar"
          />
        </div>
        <textarea
          name="message"
          :placeholder="`What's on your mind, ${firstName}?`"
          class="w-full ml-4 rounded-lg p-2 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
          v-model="content"
        ></textarea>
      </div>

      <div class="flex gap-2">
        <div v-if="uploads.length > 0" class="flex gap-2">
          <div
            v-for="(upload, i) in uploads"
            :key="`upload${i}`"
            class="overflow-hidden rounded-xl col-span-3 h-[6rem] w-[8rem]"
          >
            <img class="h-full w-full object-cover" :src="upload" alt="" />
          </div>
        </div>
        <div
          v-if="isUploading"
          class="flex items-center justify-center h-[6rem] w-[8rem] bg-gray-300 rounded dark:bg-gray-700"
        >
          <svg
            class="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
            />
          </svg>
          <div role="status" class="absolute">
            <svg
              aria-hidden="true"
              class="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>

      <footer class="flex justify-end mt-0 pt-2 pb-1 mx-2">
        <div class="flex gap-2">
          <label
            class="justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 flex items-center text-sm mr-4 cursor-pointer hover:bg-secondary"
          >
            <input type="file" class="hidden" @change="addPhotos" />
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 w-4 h-4"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Photos
          </label>
          <!-- <span
              class="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="css-i6dzq1"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
            <span
              class="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="css-i6dzq1"
              >
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </span> -->
        </div>
        <Button class="flex items-center text-sm bg-primary text-secondary">
          Post
          <svg
            class="ml-2"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </Button>
      </footer>
    </form>
  </Card>
</template>
