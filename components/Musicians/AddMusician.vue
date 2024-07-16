<script lang="ts" setup>
import { ref } from "vue";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";

// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");

const isOpen = ref(false);
const mbid = ref("15ab8bb8-7348-4377-ab73-b7acdad1459c");
const newArtistName = ref();
const alertMessage = ref("");
const artistExists = ref(false);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const checkArtist = async (id: String) => {
  console.log("hello", id);
  try {
    const megaList = `https://musicbrainz.org/ws/2/artist/${id}?&fmt=json`;
    const { data, error } = await useFetch(megaList);

    if (data) {
      newArtistName.value = data.value.name;
      alertMessage.value = `You've selected ${newArtistName.value}. Is this the correct artist?`;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const addArtist = async (mbid) => {
  const supabase = useSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("musicians")
      .upsert({ id: mbid, name: newArtistName.value })
      .select();

    if (data === null) {
      alertMessage.value =
        "I'm sorry but  that artist exists. Please try again.";
      artistExists.value = true;
      await delay(1000);
      isOpen.value = false;
      await delay(1000);
      alertMessage.value = "";
      mbid = null;
      newArtistName.value = null;
      artistExists.value = false;
    } else {
      isOpen.value = false;
    }
  } catch (error) {
    console.log("EXISTS", error);
  }
};
</script>

<template>
  <div>
    <UseTemplate>
      <form
        @submit.prevent="addArtist(mbid)"
        class="grid items-start gap-4 px-4"
      >
        <div v-if="!newArtistName" class="grid gap-2">
          <Label html-for="mbid">Artist MBID</Label>
          <Input
            id="mbid"
            type="text"
            placeholder="e.g.15ab8bb8-7348-4377-ab73-b7acdad1459c"
            v-model="mbid"
          />
          <Button type="button" class="mt-2" @click="checkArtist(mbid)">
            Add Musician
          </Button>
        </div>
        <div v-else class="grid gap-2">
          <p>{{ alertMessage }}</p>
          <Button v-if="!artistExists" type="submit" class="mt-2">
            Yes. Save changes
          </Button>
        </div>
      </form>
    </UseTemplate>

    <Dialog v-if="isDesktop" v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline" @click="open = true"> Add a musician </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a musician</DialogTitle>
          <DialogDescription>
            Add a new musician via their MBID
          </DialogDescription>
        </DialogHeader>
        <GridForm />
      </DialogContent>
    </Dialog>

    <Drawer v-else v-model="open" v-model:open="isOpen">
      <DrawerTrigger as-child>
        <Button variant="outline" @click="open = true"> Add a musician </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="text-left">
          <DrawerTitle>Add a musician</DrawerTitle>
          <DrawerDescription>
            Add a new musician via their MBID
          </DrawerDescription>
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
