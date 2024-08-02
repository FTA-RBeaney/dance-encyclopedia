<script setup>
import { columns } from "../components/Favourites/columns.ts";

const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const colorMode = useColorMode();
const favourites = ref();

const userImage = computed(() => {
  const picture = supabaseUser?.value?.user_metadata?.picture.replace(
    "=s96-c",
    ""
  );
  return picture;
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
    <div class="pt-3">
      <div class="">
        <p class="py-2 text-lg font-semibold">Email Address</p>
        <div class="sm:flex-row sm:items-center sm:justify-between">
          <p class="text-gray-600">
            Your email address is <strong>{{ supabaseUser.email }}</strong>
          </p>
          <div class="flex w-100 mt-2">
            <!-- <Button class="mr-4">Change</Button> -->
            <Button type="submit" @click="userLogout"> Sign Out </Button>
          </div>
        </div>

        <hr class="mt-4 mb-8" />
        <p class="py-2 text-lg font-semibold">Theme</p>
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
                <SelectItem value="blue">Blue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <p class="pt-2 text-lg font-semibold">Your Favourites</p>

    <FavouritesDataTable
      v-if="favourites"
      :columns="columns"
      :data="favourites"
      class="mt-4"
    />
    <p v-else>No favourites added yet. Come back when you've added some!</p>
  </div>
</template>
