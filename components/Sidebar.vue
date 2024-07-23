<script setup>
import { playlists } from "~/data/playlists";
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const isUserLoggedIn = ref(false);
</script>

<template>
  <div
    class="pb-12 lg:block dark:bg-gray-800 dark:border-gray-700 dark:text-white"
  >
    <div class="space-y-4 py-4">
      <div class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Discover</h2>
        <div class="space-y-1">
          <!-- <NuxtLink to="/moves">
            <Button variant="ghost" class="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="mr-2 h-4 w-4"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Browse
            </Button>
          </NuxtLink> -->

          <NuxtLink to="/videos">
            <Button variant="ghost" class="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Watch
            </Button>
          </NuxtLink>
          <NuxtLink to="/dancers">
            <Button variant="ghost" class="w-full justify-start">
              <IconsPerson />
              Dancers
            </Button>
          </NuxtLink>
          <NuxtLink to="/musicians">
            <Button variant="ghost" class="w-full justify-start">
              <IconsMicrophone />
              Musicians
            </Button>
          </NuxtLink>
        </div>
      </div>
      <!-- <div class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Library</h2>
        <div class="space-y-1">
          <Button variant="ghost" class="w-full justify-start">
            <IconsPlaylist />
            Playlists
          </Button> -->
      <!-- <Button variant="ghost" class="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="mr-2 h-4 w-4"
            >
              <circle cx="8" cy="18" r="4" />
              <path d="M12 18V2l7 4" />
            </svg>
            Songs
          </Button> -->

      <!-- <Button variant="ghost" class="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="mr-2 h-4 w-4"
            >
              <path d="m16 6 4 14" />
              <path d="M12 6v14" />
              <path d="M8 8v12" />
              <path d="M4 4v16" />
            </svg>
            Albums
          </Button> -->
      <!-- </div>
      </div> -->

      <div class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
          Playlists
        </h2>
        <div class="space-y-1">
          <div
            v-for="(playlist, index) in playlists"
            :key="`playlist-${index}`"
          >
            <NuxtLink :to="`/playlist/${playlist.id}`">
              <Button variant="ghost" class="w-full justify-start">
                <IconsPlaylist />
                {{ playlist.name }}
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <SidebarFavourites v-if="supabaseUser" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.router-link-active {
  button {
    background-color: hsl(var(--accent));
  }
}
</style>
