<script lang="ts" setup>
import { ref } from "vue";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { CirclePlus } from "lucide-vue-next";

// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");
const { $toast } = useNuxtApp();
const open = ref();
const isOpen = ref(false);

const nuxtApp = useNuxtApp();

const getArtistAlbum = nuxtApp.getArtistAlbum;
const getTrackInfo = nuxtApp.getTrackInfo;
const getTrack = nuxtApp.getTrack;

const spotifyInfo = ref();
const spotifyId = ref();

const openDialog = () => {
  open.value = !open.value;
};

const addAlbum = async (spotifyId) => {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();

  //   spotifyInfo.value = res;
  isOpen.value = false;

  const trackInfo = await getTrack(spotifyId);
  const audioAnalysisInfo = await getTrackInfo(spotifyId);

  const res = await getArtistAlbum(trackInfo.album.id);
  spotifyInfo.value = res;

  try {
    const { data, error } = await supabase
      .from("albums")
      .upsert(
        {
          id: trackInfo.album.id,
          name: trackInfo.album.name,
          created_by: supabaseUser.value.id,
          spotify_info: spotifyInfo.value,
          artist: trackInfo.artists[0].name,
          type: "album",
        },
        { onConflict: "id" }
      )
      .select();

    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("EXISTS", error);
  }

  try {
    const { data, error } = await supabase
      .from("tracks")
      .upsert({
        id: spotifyId,
        name: trackInfo.name,
        created_by: supabaseUser.value.id,
        spotify_info: trackInfo,
        type: "track",
        album_id: trackInfo.album.id,
        album_name: trackInfo.album.name,
        artist: trackInfo.artists[0].name,
        bpm: audioAnalysisInfo.track.tempo,
        duration: audioAnalysisInfo.track.duration,
      })
      .select();
    if (error) {
      console.log(error);
    } else {
      $toast("Success!", {
        description: "Track successfully added.",
      });
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
        @submit.prevent="addAlbum(spotifyId)"
        class="grid items-start gap-4 px-4"
      >
        <div class="grid gap-2">
          <Label html-for="url">Spotify ID</Label>
          <Input
            id="url"
            type="text"
            placeholder="4aawyAB9vmqN3uQ7FjRGTy"
            v-model="spotifyId"
          />
          <Button type="submit" class="mt-2">
            <CirclePlus class="mr-2 h-4 w-4" /> Add a track
          </Button>
        </div>
      </form>
    </UseTemplate>

    <Dialog v-if="isDesktop" v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline" @click="openDialog"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a track
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add an album</DialogTitle>
          <DialogDescription> Add the Spotify ID below </DialogDescription>
        </DialogHeader>
        <GridForm />
      </DialogContent>
    </Dialog>

    <Drawer v-else v-model="open" v-model:open="isOpen">
      <DrawerTrigger as-child>
        <Button variant="outline" @click="openDialog"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a track
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
