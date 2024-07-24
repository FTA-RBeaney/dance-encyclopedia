<template>
  <div
    class="bg-primary-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
  >
    <div class="flex flex-row items-center justify-between py-6 px-4">
      <NuxtLink to="/" class="text-xl font-medium">
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
      </NuxtLink>
      <NuxtLink v-if="isAdmin" to="/classes">
        <Button variant="ghost" class="w-full justify-start">
          <IconsPerson class="mr-2" />
          Classes
        </Button>
      </NuxtLink>
      <nav class="flex flex-row justify-end items-center">
        <!-- <NuxtLink class="font-medium px-2" to="/about">About Us</NuxtLink> -->
        <NuxtLink v-if="!supabaseUser" class="font-medium px-2" to="/login"
          >Login</NuxtLink
        >
        <div v-else class="flex items-center">
          <NuxtLink class="font-medium px-2" to="/account">
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

<script setup>
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();
const { data: isAdmin, error } = await supabase
  .from("profiles")
  .select("is_admin")
  .eq("id", supabaseUser.value.id);

const avatar = computed(() => supabaseUser?.value.user_metadata.avatar_url);
const fullName = computed(() => supabaseUser?.value.user_metadata.full_name);
</script>
