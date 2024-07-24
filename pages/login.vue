<script setup>
definePageMeta({
  layout: "login",
});

import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@nuxtbase/auth-ui-vue";
const supabaseClient = useSupabaseClient();

const supabaseUser = useSupabaseUser();
const fullName = computed(() => supabaseUser?.value?.user_metadata?.full_name);

const videoUrl = await getLatestVideo();

const backgrounds = [
  "http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01bb08ad4ee9970d.jpg",
  "http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01b7c808a74f970b.jpg",
  "https://media.gettyimages.com/id/1423946615/photo/the-lindy-hop.jpg?s=1024x1024&w=gi&k=20&c=gxsTzfTYweK9VMbRPJoCg6JQmN4DVvSVerXGh7vJrxc=",
  "https://i.ytimg.com/vi/-19HZZcMKX0/maxresdefault.jpg",
  "https://i0.wp.com/blog.straycat.me.uk/wp-content/uploads/2024/02/Hellzapoppin-New-YT-Cover-2.png?fit=1116%2C714&ssl=1",
];

const bgImage = ref();

function changeBg() {
  const randIndex = Math.floor(Math.random() * backgrounds.length);
  bgImage.value = backgrounds[randIndex];
}
changeBg();
</script>

<style scoped>
body {
  margin: 0;
}
</style>

<template>
  <div class="h-full">
    <div class="md:hidden">
      <NuxtImg
        alt="Authentication"
        width="1280"
        height="1214"
        class="block"
        :src="bgImage"
      />
    </div>

    <div
      class="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <a href="/login" class="ghost absolute right-4 top-4 md:right-8 md:top-8">
        Login
      </a>
      <div
        class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex bg-center bg-no-repeat bg-cover"
        :style="`background-image: url('${bgImage}')`"
      >
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
          Dance Encyclopedia
        </div>
        <!-- <div class="relative z-20 mt-auto">
          <blockquote class="space-y-2">
            <p class="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer class="text-sm">Sofia Davis</footer>
          </blockquote>
        </div> -->
      </div>
      <div class="lg:p-8">
        <div
          class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        >
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p class="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <Auth
            :supabaseClient="supabaseClient"
            :appearance="{
              theme: ThemeSupa,
            }"
            :providers="['google']"
          />
          <p class="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our
            <a
              href="/terms"
              class="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>
            and
            <a
              href="/privacy"
              class="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
