<template>
  <div>
    <div class="bg-gray-900 mx-auto">
      <section class="relative page-hero items-center flex">
        <video loop muted autoplay playsinline class="background-video">
          <source
            src="https://res.cloudinary.com/dgbn0ttzf/video/upload/v1731419446/Lindy_Clips_BG_ruarys.mp4"
            type="video/mp4"
          />
        </video>
        <div class="relative z-10 mx-auto px-4 py-28 md:px-4">
          <div class="space-y-5 max-w-[1200px] mx-auto text-center">
            <h2
              class="text-4xl text-white font-extrabold mx-auto md:text-9xl lg:text-9xl"
            >
              Welcome to the Dance Encyclopedia!
            </h2>
            <!-- <p class="max-w-2xl mx-auto text-gray-400">
              Sed ut perspiciatis unde omnis iste natus voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae.
            </p>
            <form
              @submit.prevent
              class="justify-center items-center gap-x-3 sm:flex"
            >
              <input
                type="text"
                placeholder="Enter your email"
                class="w-full px-3 py-2.5 text-gray-400 bg-gray-700 focus:bg-gray-900 duration-150 outline-none rounded-lg shadow sm:max-w-sm sm:w-auto"
              />
              <button
                class="flex items-center justify-center gap-x-2 py-2.5 px-4 mt-3 w-full text-sm text-white font-medium bg-sky-500 hover:bg-sky-400 active:bg-sky-600 duration-150 rounded-lg sm:mt-0 sm:w-auto"
              >
                Get started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </form> -->
            <div class="justify-center items-center gap-x-3 sm:flex">
              <NuxtLink v-if="user" to="/account">
                <button
                  class="flex items-center justify-center gap-x-2 py-2.5 px-4 mt-3 w-full text-sm text-white font-medium bg-sky-500 hover:bg-sky-400 active:bg-sky-600 duration-150 rounded-lg sm:mt-0 sm:w-auto"
                >
                  View your profile
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </NuxtLink>
              <NuxtLink v-else to="/login">
                <button
                  class="flex items-center justify-center gap-x-2 py-2.5 px-4 mt-3 w-full text-sm text-white font-medium bg-sky-500 hover:bg-sky-400 active:bg-sky-600 duration-150 rounded-lg sm:mt-0 sm:w-auto"
                >
                  Get started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </NuxtLink>
            </div>
            <!-- <div
              class="flex justify-center items-center gap-x-4 text-gray-400 text-sm"
            >
              <div class="flex">
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  />
                </svg>
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753 .381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  />
                </svg>
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753 .381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  />
                </svg>
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753 .381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  />
                </svg>
              </div>
              <p><span class="text-gray-100">5.0</span> by over 200 users</p>
            </div> -->
          </div>
        </div>
        <!-- <div
          class="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
          style="
            background: linear-gradient(
              106.89deg,
              rgba(192, 132, 252, 0.11) 15.73%,
              rgba(14, 165, 233, 0.41) 15.74%,
              rgba(232, 121, 249, 0.26) 56.49%,
              rgba(79, 70, 229, 0.4) 115.91%
            );
          "
        ></div> -->
        <div
          class="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
          style="
            background: linear-gradient(
              106.89deg,
              rgba(0, 0, 0, 0.4) 15.73%,
              rgba(0, 0, 0, 0.6) 15.74%,
              rgba(0, 0, 0, 0.8) 56.49%,
              rgba(0, 0, 0, 1) 115.91%
            );
          "
        ></div>
      </section>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: Object,
});
</script>

<style scoped>
h2 {
  /* font-size: 5rem; */
}
.background-video {
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 50%;
  opacity: 1;
  width: 120%;
  max-width: 120%;
  transform: translate(-50%, -50%);
}

.page-hero {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.background-video-content {
  position: relative;
  z-index: 1;
}

video[poster] {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
