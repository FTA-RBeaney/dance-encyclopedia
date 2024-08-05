<script setup>
useSeoMeta({
  title: "Dance Encyclopedia",
  ogTitle: "Dance Encyclopedia",
  ogImage:
    "http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01bb08ad4ee9970d.jpg",
  twitterCard: "summary_large_image",
});

import { ConfigProvider } from "radix-vue";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";

const useIdFunction = () => useId();
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <div class="bg-background">
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <Toaster />
  </ConfigProvider>
</template>

<style>
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
