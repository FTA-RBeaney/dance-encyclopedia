<script setup>
import {
  firstNavigation,
  danceNavigation,
  musicNavigation,
} from "../data/navigation";
import { playlists } from "~/data/playlists";
import * as lucideIcons from "lucide-vue-next";

const search = ref("");

const user = {
  avatar: "https://randomuser.me/api/portraits/med/men/2.jpg",
  username: "Jane Doe",
  email: "muzcad@he.tg",
};

const topNav = [
  { title: "Home", icon: "lucide:home", link: "#" },
  {
    title: "Dashboard",
    icon: "lucide:bar-chart-3",
    items: [
      { title: "Overview", link: "#" },
      { title: "Notifications", link: "#" },
      { title: "Analytics", link: "#" },
      { title: "Reports", link: "#" },
    ],
  },
  { title: "Projects", icon: "lucide:folder-dot", link: "#" },
  { title: "Tasks", icon: "lucide:list-checks", link: "#" },
  { title: "Users", icon: "lucide:users", link: "#" },
];
const bottomNav = [
  { title: "Support", icon: "lucide:life-buoy", link: "#" },
  {
    title: "Settings",
    icon: "lucide:settings-2",
    items: [
      { title: "Profile", link: "#" },
      { title: "Account", link: "#" },
      { title: "Security", link: "#" },
      { title: "Billing", link: "#" },
    ],
  },
];

const colorMode = useColorMode();
import { Bug, Settings, BookHeart, LogOut } from "lucide-vue-next";
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const feedbackList = ref([]);

const { data: isAdmin, error } = await supabase
  .from("profiles")
  .select("is_admin")
  .eq("id", supabaseUser?.value?.id);

const avatar = computed(() => supabaseUser?.value.user_metadata.avatar_url);
const fullName = computed(() => supabaseUser?.value.user_metadata.full_name);
const email = computed(() => supabaseUser?.value.user_metadata.email);

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

const navigation = [
  {
    href: "javascript:void(0)",
    name: "Overview",
  },
  {
    href: "javascript:void(0)",
    name: "Integration",
  },
  {
    href: "javascript:void(0)",
    name: "Plans",
  },
  {
    href: "javascript:void(0)",
    name: "Transactions",
  },
];

const navsFooter = [
  {
    href: "javascript:void(0)",
    name: "Help",
  },
  {
    href: "javascript:void(0)",
    name: "Settings",
  },
  {
    href: "javascript:void(0)",
    name: "Logout",
  },
];

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
</script>

<template>
  <div class="flex flex-col justify-between text-neutral-900">
    <Card class="rounded-none">
      <Navbar />
    </Card>
  </div>
  <div class="min-h-screen lg:flex">
    <nav
      class="fixed top-0 left-0 w-full h-full border-r bg-white space-y-8 sm:w-80"
    >
      <div class="flex flex-col h-full bg-white">
        <div class="h-20 flex items-center px-8">
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
        </div>
        <div class="flex-1 flex flex-col h-full overflow-auto">
          <div class="flex-1">
            <div class="py-2">
              <ul class="px-4 text-sm font-medium flex-1">
                <li
                  :to="item.path"
                  v-for="(item, i) in firstNavigation"
                  :key="`nav${i}`"
                >
                  <a
                    href="#"
                    class="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150"
                  >
                    <div class="text-gray-500" x-html="item.icon"></div>
                    <span x-text="item.name">{{ item.title }}</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="py-2">
              <div class="mb-2 px-4 text-lg font-semibold tracking-tight">
                Dance
              </div>
              <ul class="px-4 text-sm font-medium flex-1">
                <li
                  :to="item.path"
                  v-for="(item, i) in danceNavigation"
                  :key="`nav${i}`"
                >
                  <a
                    href="#"
                    class="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150"
                  >
                    <div class="text-gray-500" x-html="item.icon"></div>
                    <span x-text="item.name">{{ item.title }}</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="py-2">
              <div class="mb-2 px-4 text-lg font-semibold tracking-tight">
                Music
              </div>
              <ul class="px-4 text-sm font-medium flex-1">
                <li
                  :to="item.path"
                  v-for="(item, i) in musicNavigation"
                  :key="`nav${i}`"
                >
                  <a
                    href="#"
                    class="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150"
                  >
                    <div class="text-gray-500" x-html="item.icon"></div>
                    <span x-text="item.name">{{ item.title }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <ul class="px-4 pb-4 text-sm font-medium">
              <li v-for="(item, idx) in navsFooter" :key="idx">
                <a
                  href="#"
                  class="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150"
                >
                  <div class="text-gray-500" x-html="item.icon"></div>
                  <span x-text="item.name">{{ item.name }}</span>
                </a>
              </li>
            </ul>
            <div class="py-4 px-4 border-t">
              <div class="flex items-center gap-x-4">
                <img
                  src="https://randomuser.me/api/portraits/women/79.jpg"
                  class="w-12 h-12 rounded-full"
                />
                <div>
                  <span class="block text-gray-700 text-sm font-semibold"
                    >Alivika tony</span
                  >
                  <a
                    href="javascript:void(0)"
                    class="block mt-px text-gray-600 hover:text-indigo-600 text-xs"
                  >
                    View profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- <aside class="h-screen lg:col-span-2 w-[330px] border-r">
      <div
        dir="ltr"
        orientation="vertical"
        class="relative overflow-hidden size-full"
      >
        <div
          data-radix-scroll-area-viewport=""
          class="h-full w-full rounded-[inherit]"
          tabindex="0"
        >
          <div>
            <div class="flex h-screen flex-col pt-7">
              <div class="flex h-full grow flex-col px-5 pb-8">
                <div class="mb-10 flex flex-col gap-10">
                  <Sidebar class="hidden lg:block" />
                </div>
                <div class="mt-auto rounded-lg bg-muted/50 p-4 text-sm">
                  <div class="flex items-center justify-between">
                    <p class="font-semibold">Used space</p>
                    <button
                      class="group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 size-6"
                      type="button"
                    >
                      <span
                        class="iconify i-lucide:x size-4 text-muted-foreground"
                        aria-hidden="true"
                      ></span>
                    </button>
                  </div>
                  <p class="mt-3 text-muted-foreground">
                    Your team has used 80% of your available space. Need more?
                  </p>
                  <div
                    aria-valuemax="100"
                    aria-valuemin="0"
                    aria-valuenow="80"
                    aria-valuetext="80%"
                    aria-label="80%"
                    role="progressbar"
                    data-state="loading"
                    data-value="80"
                    data-max="100"
                    class="relative w-full overflow-hidden rounded-full bg-secondary my-4 h-2"
                  >
                    <div
                      data-state="loading"
                      data-value="80"
                      data-max="100"
                      class="h-full w-full flex-1 rounded-full bg-primary transition-all"
                      style="transform: translateX(-20%)"
                    ></div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      class="group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 gap-2 px-2"
                      type="button"
                    >
                      Dismiss
                    </button>
                    <button
                      class="group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 gap-2 px-2 text-sky-500 hover:text-sky-600"
                      type="button"
                    >
                      Upgrade plan
                    </button>
                  </div>
                </div>
                <div
                  class="flex w-full items-center text-center align-middle flex-row my-6"
                >
                  <div
                    data-orientation="horizontal"
                    role="separator"
                    class="flex border-border w-full border-t border-solid"
                  ></div>
                  <div
                    data-orientation="horizontal"
                    role="separator"
                    class="flex border-border w-full border-t border-solid"
                  ></div>
                </div>
                <div class="flex items-center gap-3 pb-8">
                  <div class="flex items-center gap-3">
                    <span
                      class="relative flex shrink-0 overflow-hidden rounded-full size-10"
                    >
                      <NuxtLink :to="`/profile/${supabaseUser.id}`">
                        <img
                          class="w-10 h-10 rounded-full mr-1"
                          alt="Default avatar"
                          :src="avatar"
                        />
                      </NuxtLink>
                    </span>
                    <div>
                      <p class="text-sm font-semibold">{{ fullName }}</p>
                      <p class="text-sm text-muted-foreground">{{ email }}</p>
                    </div>
                  </div>
                  <button
                    class="group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-4 text-muted-foreground gap-2 ml-auto shrink-0"
                    type="button"
                    data-state="closed"
                    data-grace-area-trigger=""
                  >
                    <LogOut :stroke-width="1.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside> -->

    <div id="main-content" class="main-content relative w-full ml-80">
      <Suspense>
        <div class="mx-auto">
          <slot />
        </div>

        <template #fallback>
          <LoadingCircle />
        </template>
      </Suspense>
    </div>
  </div>
</template>
