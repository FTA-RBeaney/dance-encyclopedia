<template>
  <div class="bg-primary-200">
    <div class="flex flex-row items-center justify-between py-6 px-4">
      <NuxtLink to="/" class="text-xl font-medium">
        <strong>Dance Encyclopedia</strong>
      </NuxtLink>
      <div v-if="supabaseUser">{{ fullName }}</div>
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

const avatar = computed(() => supabaseUser?.value.user_metadata.avatar_url);
const fullName = computed(() => supabaseUser?.value.user_metadata.full_name);
</script>
