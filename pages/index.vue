<script setup>
definePageMeta({
  pageTransition: {
    name: "slide",
    mode: "out-in",
  },
  layout: "homepage",
});

const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const userData = ref();

onMounted(async () => {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("id", supabaseUser.value.id);
  userData.value = data[0];
});
</script>

<template>
  <div>
    <header>
      <div
        class="w-full bg-center bg-cover h-[34rem]"
        style="
          background-image: url('http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01bb08ad4ee9970d.jpg');
        "
      >
        <div
          class="flex items-center justify-center w-full h-full bg-gray-900/40"
        >
          <div class="text-center">
            <h1 class="text-4xl font-semibold text-white lg:text-6xl">
              Welcome
              <span class="text-secondary dark:text-primary">{{
                userData?.first_name
              }}</span
              >!
            </h1>

            <!-- <button
            class="w-full px-5 py-2 mt-4 text-sm font-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
          >
            Start project
          </button> -->
          </div>
        </div>
      </div>
    </header>
    <div class="flex container justify-between mt-8 max-w-screen-lg mx-auto">
      <div class="w-8/12">
        <Card class="p-4">
          <p>
            Thanks for checking out the site. This is a work in progress, so
            some things may not work and there may be bugs. If you find anything
            or think of anything you'd like to see on this site then feel free
            to let me know by clicking on 'Add feedback/bug' in the navigation
            bar above and leaving a note!
          </p>
        </Card>
      </div>
      <div class="w-4/12 max-w-xs pl-4">
        <Card class="p-4">
          <UserList />
        </Card>
      </div>
    </div>
  </div>
</template>
