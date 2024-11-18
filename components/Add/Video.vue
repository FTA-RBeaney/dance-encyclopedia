<script lang="ts" setup>
import { ref } from "vue";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { CirclePlus } from "lucide-vue-next";

// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");
const open = ref();
const isOpen = ref(false);
const newArtistName = ref();
const alertMessage = ref("");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const addVideo = async (url) => {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();

  try {
    const { data, error } = await supabase
      .from("videos")
      .upsert(
        {
          created_by: supabaseUser.value.id,
          url: url,
        },
        { onConflict: "id" }
      )
      .select();

    if (data === null) {
      push.error("This video already exists");

      isOpen.value = false;
      await delay(1000);
      alertMessage.value = "";
      url = null;
    } else {
      push.success("Video successfully added!");
      isOpen.value = false;
      await delay(1000);
      alertMessage.value = "";
      url = null;
      newArtistName.value = null;
    }
  } catch (error) {
    console.log("EXISTS", error);
  }
};
</script>

<template>
  <div>
    <UseTemplate>
      <form @submit.prevent="addVideo(url)" class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <Label html-for="url">YouTube URL</Label>
          <Input
            id="url"
            type="text"
            placeholder="https://www.youtube.com/watch?v=w-1YJyi0wag"
            v-model="url"
          />
          <Button type="submit" class="mt-2">
            <CirclePlus class="mr-2 h-4 w-4" /> Add a video
          </Button>
        </div>
      </form>
    </UseTemplate>

    <Dialog v-if="isDesktop" v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline" @click="open = true"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a video
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a video</DialogTitle>
          <DialogDescription> Add the URL below </DialogDescription>
        </DialogHeader>
        <GridForm />
      </DialogContent>
    </Dialog>

    <Drawer v-else v-model="open" v-model:open="isOpen">
      <DrawerTrigger as-child>
        <Button variant="outline" @click="open = true"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a video
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="text-left">
          <DrawerTitle>Add a video</DrawerTitle>
          <DrawerDescription> Add the URL below </DrawerDescription>
        </DrawerHeader>
        <GridForm />
        <DrawerFooter class="pt-2">
          <DrawerClose as-child>
            <Button variant="outline"> Cancel </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
