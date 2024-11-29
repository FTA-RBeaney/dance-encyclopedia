<script setup>
import {
  firstNavigation,
  danceNavigation,
  musicNavigation,
} from "../data/navigation";
import { playlists } from "~/data/playlists";
import * as lucideIcons from "lucide-vue-next";
import { HandCoins, School, TicketSlash } from "lucide-vue-next";
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const { data, refresh } = await useAsyncData("sidebarPosts", async () => {
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

const { data: isAdmin, error } = await supabase
  .from("profiles")
  .select("is_admin")
  .eq("id", supabaseUser?.value?.id);
</script>

<template>
  <div
    class="sidebar pb-12 lg:block dark:bg-black/[.1] dark:border-gray-700 dark:text-white"
  >
    <div class="space-y-4 py-4">
      <div class="py-2">
        <NuxtLink
          :to="item.path"
          v-for="(item, i) in firstNavigation"
          :key="`nav${i}`"
        >
          <Button
            variant="ghost"
            class="w-full flex justify-between items-center relative font-normal"
          >
            <div class="flex items-center">
              <component
                :is="lucideIcons[item.icon]"
                :stroke-width="1.5"
                class="mr-2 w-4 h-4"
              />

              {{ item.title }}
            </div>
            <div
              v-if="item.count"
              class="relative grid items-center px-2 py-0.5 font-sans text-xs font-bold text-gray-900 uppercase rounded-full select-none whitespace-nowrap bg-gray-100 group-hover:bg-white/20 group-hover:text-white"
            >
              {{ data?.length }}
            </div>
          </Button>
        </NuxtLink>
      </div>

      <div class="py-2">
        <div class="mb-2 px-4 text-lg font-semibold tracking-tight">Dance</div>
        <div class="space-y-1">
          <NuxtLink
            v-for="(item, i) in danceNavigation"
            :key="`nav${i}`"
            :to="item.path"
          >
            <Button
              variant="ghost"
              class="w-full flex justify-between items-center relative font-normal"
            >
              <div class="flex items-center">
                <component
                  :is="lucideIcons[item.icon]"
                  :stroke-width="1.5"
                  class="mr-2 w-4 h-4"
                />

                {{ item.title }}
              </div>
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="py-2">
        <div class="mb-2 px-4 text-lg font-semibold tracking-tight">Music</div>
        <div class="space-y-1">
          <NuxtLink
            :to="item.path"
            v-for="(item, i) in musicNavigation"
            :key="`nav${i}`"
          >
            <Button
              variant="ghost"
              class="w-full flex justify-between items-center relative font-normal"
              :disabled="item.disabled"
            >
              <div class="flex items-center">
                <component
                  :is="lucideIcons[item.icon]"
                  :stroke-width="1.5"
                  class="mr-2 w-4 h-4"
                />

                {{ item.title }}
              </div>
            </Button>
          </NuxtLink>
        </div>
      </div>

      <div class="py-2" v-if="isAdmin">
        <div class="mb-2 px-4 text-lg font-semibold tracking-tight">
          Sunshine Swing
        </div>
        <div class="space-y-1">
          <NuxtLink to="/classes">
            <Button
              variant="ghost"
              class="w-full flex justify-between items-center relative font-normal"
            >
              <div class="flex items-center">
                <School :stroke-width="1.5" class="mr-2 w-4 h-4" />
                <div class="flex items-center">Classes</div>
              </div>
            </Button>
          </NuxtLink>
          <NuxtLink to="/socials">
            <Button
              variant="ghost"
              class="w-full flex justify-between items-center relative font-normal"
            >
              <div class="flex items-center">
                <TicketSlash :stroke-width="1.5" class="mr-2 w-4 h-4" />
                <div class="flex items-center">Socials</div>
              </div>
            </Button>
          </NuxtLink>
          <NuxtLink to="/expenses">
            <Button
              variant="ghost"
              class="w-full flex justify-between items-center relative font-normal"
            >
              <div class="flex items-center">
                <HandCoins :stroke-width="1.5" class="mr-2 w-4 h-4" />
                <div class="flex items-center">Expenses</div>
              </div>
            </Button>
          </NuxtLink>
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
