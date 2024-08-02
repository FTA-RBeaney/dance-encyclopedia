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
    <Heading
      title="Favourites"
      description="All your favourites in one place"
    />
    <Card class="p-4">
      <p class="py-2 text-xl font-semibold">Your Favourites</p>

      <FavouritesDataTable
        v-if="favourites"
        :columns="columns"
        :data="favourites"
        class="mt-4"
      />
      <p v-else>No favourites added yet. Come back when you've added some!</p>
    </Card>
  </div>
</template>
