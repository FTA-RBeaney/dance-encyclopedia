<template>
  <nav class="bg-white w-full top-0 z-20">
    <div class="items-center px-4 max-w-screen-xl mx-auto lg:flex lg:px-8">
      <div class="flex items-center justify-between py-3 lg:py-6 lg:block">
        <a href="javascript:void(0)">
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
        </a>
        <div class="lg:hidden">
          <button
            class="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
            @click="menuOpen()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
              :class="[open ? 'block' : 'hidden']"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              :class="[open ? 'hidden' : 'block']"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        class="flex-1 justify-between flex-row-reverse lg:overflow-visible lg:flex lg:pb-0 lg:pr-0 lg:h-auto"
        :class="[open ? 'h-screen pb-20 overflow-auto pr-4' : 'hidden']"
      >
        <div>
          <ul
            class="flex flex-col-reverse space-x-0 lg:space-x-6 lg:flex-row items-center"
          >
            <li class="mt-8 lg:mt-0">
              <!-- <a
                href="javascript:void(0)"
                class="py-3 px-4 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow block lg:inline"
              >
                Sign Up
              </a> -->
              <NuxtLink
                v-if="!supabaseUser"
                class="font-medium px-2 block lg:inline"
                to="/login"
                ><Button class="relative">Login</Button></NuxtLink
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
            </li>
          </ul>
        </div>
        <!-- <div class="flex-1 items-">
          <ul
            class="justify-center items-center space-y-8 lg:flex lg:space-x-6 lg:space-y-0 h-full"
          >
            <li
              v-for="link in navigation"
              :key="link.id"
              class="text-gray-600 hover:text-indigo-600"
            >
              <a :href="link.router">
                {{ link.title }}
              </a>
            </li>
          </ul>
        </div> -->
      </div>
    </div>
  </nav>
</template>

<style scoped>
.sticky-nav {
  animation: sticky-nav 300ms;
}

@keyframes sticky-nav {
  0% {
    transform: translateY(-6em);
  }

  100% {
    transform: translateY(0);
  }
}
</style>

<script setup>
const supabaseUser = useSupabaseUser();
const open = ref(false);
function menuOpen() {
  open.value = !open.value;
}

const avatar = computed(() => supabaseUser?.value.user_metadata.avatar_url);
</script>
