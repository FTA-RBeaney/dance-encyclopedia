<script setup>
import {
  firstNavigation,
  danceNavigation,
  musicNavigation,
} from "../data/navigation";
import { playlists } from "~/data/playlists";
import * as lucideIcons from "lucide-vue-next";
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const { data, refresh } = await useAsyncData("posts", async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .is("parent", null);
    return data;
  } catch (error) {
    alert(error.message);
  }
});
</script>

<template>
  <div
    class="pb-12 lg:block dark:bg-black/[.1] dark:border-gray-700 dark:text-white"
  >
    <div class="space-y-4 py-4">
      <div class="px-3 py-2">
        <NuxtLink
          v-for="(item, i) in firstNavigation"
          :key="`nav${i}`"
          :to="item.path"
        >
          <Button
            variant="ghost"
            class="w-full flex justify-between items-center relative"
          >
            <div class="flex items-center">
              <component :is="lucideIcons[item.icon]" class="mr-2 w-4 h-4" />

              {{ item.title }}
            </div>
            <div
              v-if="item.count"
              class="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
            >
              {{ data.length }}
            </div>
          </Button>
        </NuxtLink>
      </div>

      <div class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Dance</h2>
        <div class="space-y-1">
          <NuxtLink
            v-for="(item, i) in danceNavigation"
            :key="`nav${i}`"
            :to="item.path"
          >
            <Button
              variant="ghost"
              class="w-full flex justify-between items-center relative"
            >
              <div class="flex items-center">
                <component :is="lucideIcons[item.icon]" class="mr-2 w-4 h-4" />

                {{ item.title }}
              </div>
              <div
                v-if="item.count"
                class="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
              >
                {{ data.length }}
              </div>
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Music</h2>
        <div class="space-y-1">
          <Button
            v-for="(item, i) in musicNavigation"
            :key="`nav${i}`"
            variant="ghost"
            class="w-full flex justify-between items-center relative"
            :disabled="item.disabled"
          >
            <NuxtLink :to="item.path">
              <div class="flex items-center">
                <component :is="lucideIcons[item.icon]" class="mr-2 w-4 h-4" />

                {{ item.title }}
              </div>
              <div
                v-if="item.count"
                class="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
              >
                {{ data.length }}
              </div>
            </NuxtLink>
          </Button>
        </div>
      </div>

      <div class="px-3 py-2" v-if="playlists?.length > 0">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
          Playlists
        </h2>
        <div class="space-y-1">
          <div
            v-for="(playlist, index) in playlists"
            :key="`playlist-${index}`"
          >
            <NuxtLink :to="`/playlist/${playlist?.id}`">
              <Button variant="ghost" class="w-full justify-start">
                <IconsPlaylist class="mr-2 min-w-4 min-h-4" />
                {{ playlist.name }}
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
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
