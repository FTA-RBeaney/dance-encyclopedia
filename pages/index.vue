<script setup>
definePageMeta({
  pageTransition: {
    name: "slide",
    mode: "out-in",
  },
  layout: "homepage",
});

import { Coffee } from "lucide-vue-next";

const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const userData = ref();

const showHideSpinner = ref(true);

onBeforeMount(() => {
  showHideSpinner.value = true;
});

onMounted(async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", supabaseUser?.value?.id);

  if (!error) {
    userData.value = data[0];
  }

  showHideSpinner.value = false;
});
</script>

<template>
  <div class="h-full" :class="!supabaseUser && 'mx-auto'">
    <LoadingCircle v-if="showHideSpinner" />
    <Hero v-else class="h-full" :user="supabaseUser" />
    <Testimonials />
    <!-- <header v-else class="h-full">

      <div
        class="w-full bg-center bg-cover h-[500px]"
        style="
          background-image: url('http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01bb08ad4ee9970d.jpg');
          background-position: center;
          background-attachment: fixed;
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-color: black;
        "
      >
        <div
          class="flex items-center justify-center w-full h-full bg-gray-900/40"
        >
          <div v-motion-roll-visible-left>
            <div class="text-center">
              <h1 class="text-4xl font-extrabold text-white lg:text-6xl">
                Welcome
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] font-extrabold"
                  >{{ userData?.first_name }}</span
                >!
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div class="flex container justify-between mt-8 max-w-screen-md mx-auto">
        <div>
          <Card class="p-4 flex flex-col justify-center">
            <p class="mb-4">
              Thanks for checking out the site. This is a work in progress, so
              some things may not work and there may be bugs. If you find
              anything or think of anything you'd like to see on this site then
              feel free to let me know by clicking on 'Add feedback/bug' in the
              navigation bar above and leaving a note.
            </p>
            <p>
              And if you like what I'm doing here and want to support me, then
              feel free to buy me a coffee!
            </p>
            <Button as-child>
              <a
                class="mx-auto flex-inline text-center mt-4"
                href="https://www.buymeacoffee.com/ftarob"
                target="_blank"
                ><Coffee class="w-4 h-4 mr-2" />Buy me a coffee</a
              >
            </Button>
          </Card>
        </div>
      </div>
    </header> -->
  </div>
</template>
