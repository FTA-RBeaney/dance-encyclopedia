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
const isOpen = ref(false);

const { data } = await supabase
  .from("profiles")
  .select()
  .eq("id", supabaseUser.value.id);
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
                data[0].first_name
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
    <div
      class="bg-white border p-6 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative w-10/12 text-center text-sm h-full flex flex-col overflow-hidden mt-6 dark:text-white mx-auto"
    >
      <p>
        Thanks for checking out the site. This is a work in progress, so some
        things may not work and ther may be bugs. If you find anything or think
        of anything you'd like to see on this site then feel free to let me
        know!
      </p>
    </div>
  </div>
</template>
