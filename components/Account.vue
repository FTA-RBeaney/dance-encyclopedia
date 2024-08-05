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
  await navigateTo("/login");
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  }
}

const themeColors = ["default", "dark", "rose", "blue"];
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
        <div class="my-4 w-96 theme-selector">
          <RadioGroup default-value="option-one" v-model="colorMode.preference">
            <div class="flex items-center space-x-2">
              <RadioGroupItem
                v-for="(themeColor, i) in themeColors"
                :key="`theme${i}`"
                :id="themeColor"
                :value="themeColor"
                :class="themeColor"
                class="w-6 h-6 fill-slate-100"
              />
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.theme-selector {
  .default {
    border-color: black;
    background: white;
  }
  .dark {
    background: black;
  }
  .blue {
    background-color: hsla(var(--blue));
    svg {
      fill: white;
      color: white;
    }
  }
  .rose {
    background-color: hsl(var(--rose));

    svg {
      fill: white;
      color: white;
    }
  }
}
</style>
