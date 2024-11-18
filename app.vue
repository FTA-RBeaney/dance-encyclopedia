<script setup>
useSeoMeta({
  title: "Dance Encyclopedia",
  ogTitle: "Dance Encyclopedia",
  ogImage:
    "http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01bb08ad4ee9970d.jpg",
  twitterCard: "summary_large_image",
});

import { ConfigProvider } from "radix-vue";

const useIdFunction = () => useId();

// push.success({
//   title: "Message sent",
//   message: "Your message has been successfully sent.",
//   position: "top-right",
// });
</script>

<template>
  <Notivue v-slot="item">
    <Notification :item="item" :theme="pastelTheme" />
  </Notivue>
  <ConfigProvider :use-id="useIdFunction">
    <div class="bg-background">
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </ConfigProvider>
</template>

<style>
html.cafe {
  filter: sepia(0.9) hue-rotate(315deg) brightness(0.9);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease-out;
}
</style>
