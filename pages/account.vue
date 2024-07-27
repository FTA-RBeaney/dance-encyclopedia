<script setup>
import { columns } from "../components/Favourites/columns.ts";

const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const colorMode = useColorMode();
const favourites = ref();

const userImage = computed(() => {
  const picture = supabaseUser.value.user_metadata.picture;
  return picture.replace("=s96-c", "");
});

const { data } = await supabase
  .from("favourites")
  .select("*")
  .eq("user_id", supabaseUser?.value?.id);

favourites.value = data;

async function userLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    await navigateTo("/login");
  }
}
</script>

<template>
  <div>
    <Heading title="Profile" description="Your details" />
    <div
      class="bg-card border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white relative w-full h-full flex flex-col overflow-hidden pb-4"
    >
      <div class="pt-3">
        <div class="col-span-8 overflow-hidden rounded-xl sm:px-8">
          <p class="py-2 text-xl font-semibold">Email Address</p>
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="text-gray-600">
              Your email address is <strong>{{ supabaseUser.email }}</strong>
            </p>
            <div>
              <Button class="mt-4 mr-4">Change</Button>
              <Button type="submit" @click="userLogout"> Sign Out </Button>
            </div>
          </div>

          <hr class="mt-4 mb-8" />
          <div class="flex">
            <div class="mr-8">
              <NuxtImg class="w-64 rounded-md" :src="userImage" />
            </div>
            <div>
              <p class="py-2 text-xl font-semibold">Password</p>
              <div class="flex items-center">
                <div
                  class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3"
                >
                  <div class="grid gap-2">
                    <Label html-for="login-password">Current Password</Label>
                    <Input
                      id="login-password"
                      type="text"
                      placeholder="***********"
                      v-model="password"
                    />
                  </div>

                  <div class="grid gap-2">
                    <Label html-for="login-password">New Password</Label>
                    <Input
                      id="login-password"
                      type="text"
                      placeholder="***********"
                      v-model="password"
                    />
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </div>
              <p class="mt-2">
                Can't remember your current password.
                <a
                  class="text-sm font-semibold text-blue-600 underline decoration-2"
                  href="#"
                  >Recover Account</a
                >
              </p>
              <Button class="mt-4">Save Password</Button>
            </div>
          </div>

          <hr class="mt-4 mb-8" />
          <div class="mb-10">
            <p class="py-2 text-xl font-semibold">Delete Account</p>
            <p
              class="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Proceed with caution
            </p>
            <p class="mt-2">
              Make sure you have taken backup of your account in case you ever
              need to get access to your data. We will completely wipe your
              data. There is no way to access your account after this action.
            </p>
            <button
              class="ml-auto text-sm font-semibold text-rose-600 underline decoration-2"
            >
              Continue with deletion
            </button>
          </div>

          <hr class="mt-4 mb-8" />
          <p class="py-2 text-xl font-semibold">Theme</p>
          <div class="my-4 w-96">
            <Select v-model="colorMode.preference">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select your theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Themes</SelectLabel>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Default</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="rose">Rose</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-card border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white relative w-full h-full flex flex-col overflow-hidden p-4 sm:px-8 mt-4"
    >
      <p class="py-2 text-xl font-semibold">Your Favourites</p>

      <FavouritesDataTable
        v-if="favourites"
        :columns="columns"
        :data="favourites"
        class="mt-4"
      />
      <p v-else>No favourites added yet. Come back when you've added some ;)</p>
    </div>
  </div>
</template>
