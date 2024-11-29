<script setup>
const colorMode = useColorMode();
import { Bug, Settings, BookHeart } from "lucide-vue-next";
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const feedbackList = ref([]);

const { data: isAdmin, error } = await supabase
  .from("profiles")
  .select("is_admin")
  .eq("id", supabaseUser?.value?.id);

const avatar = computed(() => supabaseUser?.value.user_metadata.avatar_url);
const fullName = computed(() => supabaseUser?.value.user_metadata.full_name);

const getFeedback = async () => {
  const { data: feedback } = await supabase
    .from("feedback")
    .select("*", { count: "exact" })
    .neq("status", "done");

  feedbackList.value = feedback;
};

const channel = supabase
  .channel("public:feedback")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "feedback",
    },

    (payload) => getFeedback()
  )
  .subscribe();

await getFeedback();

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>

<template>
  <div class="dark:bg-black/[.1] dark:border-gray-700 dark:text-white">
    <div class="flex flex-row items-center justify-between py-6 px-4">
      <!-- <NuxtLink to="/" class="text-xl font-medium">
        <div class="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="mr-2 h-6 w-6"
          >
            <path
              d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
            />
          </svg>
          <strong>Dance Encyclopedia</strong>
        </div>
      </NuxtLink> -->
      <Admin v-if="supabaseUser" />

      <div class="flex" v-if="supabaseUser">
        <FeedbackAdd class="mr-4" />
        <NuxtLink to="/feedback">
          <Button class="relative"
            ><Bug class="w-4 h-4 mr-2" /> View feedback
            <div
              class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
            >
              {{ feedbackList.length }}
            </div>
          </Button>
        </NuxtLink>
      </div>
      <nav class="flex flex-row justify-end items-center">
        <NuxtLink v-if="!supabaseUser" class="font-medium px-2" to="/login"
          >Login</NuxtLink
        >
        <div v-else class="flex items-center">
          <Sheet>
            <SheetTrigger>
              <Settings :stroke-width="1.5" class="mr-2" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Profile</SheetTitle>
                <SheetDescription> </SheetDescription>
              </SheetHeader>
              <Account />
            </SheetContent>
          </Sheet>
          <NuxtLink class="font-medium px-2 mr-2" to="/favourites">
            <BookHeart :stroke-width="1.5" />
          </NuxtLink>
          <NuxtLink :to="`/profile/${supabaseUser.id}`">
            <img
              class="w-10 h-10 rounded-full mr-1"
              alt="Default avatar"
              :src="avatar"
            />
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>
