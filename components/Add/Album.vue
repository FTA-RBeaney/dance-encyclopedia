<script lang="ts" setup>
import { ref } from "vue";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { useToast } from "@/components/ui/toast/use-toast";
import { CirclePlus } from "lucide-vue-next";

// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");
const { toast } = useToast();
const open = ref();
const isOpen = ref(false);
const newArtistName = ref();
const alertMessage = ref("");

const nuxtApp = useNuxtApp();

const getArtistAlbum = nuxtApp.getArtistAlbum;
const getTrackInfo = nuxtApp.getTrackInfo;

const spotifyInfo = ref();
const spotifyId = ref();

let trackList = ref([]);

const openDialog = () => {
  open.value = !open.value;
};

const addAlbum = async (spotifyId) => {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();

  const res = await getArtistAlbum(spotifyId);
  spotifyInfo.value = res;
  isOpen.value = false;

  try {
    const { data, error } = await supabase
      .from("albums")
      .upsert(
        {
          id: spotifyId,
          name: spotifyInfo.value.name,
          created_by: supabaseUser.value.id,
          spotify_info: spotifyInfo.value,
          artist: spotifyInfo.value.artists[0].name,
          type: "album",
        },
        { onConflict: "id" }
      )
      .select();

    if (error) {
      console.log(error);
    } else {
      toast({
        title: "Success!",
        description: "Video successfully added.",
        variant: "success",
      });
    }
  } catch (error) {
    console.log("EXISTS", error);
  }

  spotifyInfo.value.tracks.items.forEach(async (track, i) => {
    const audioAnalysisInfo = await getTrackInfo(track.id);

    try {
      const { data, error } = await supabase
        .from("tracks")
        .upsert({
          id: track.id,
          name: track.name,
          created_by: supabaseUser.value.id,
          spotify_info: track,
          type: "track",
          album_id: spotifyId,
          album_name: spotifyInfo.value.name,
          artist: track.artists[0].name,
          bpm: audioAnalysisInfo.track.tempo,
        })
        .select();
      if (error) {
        console.log(error);
      } else {
        toast({
          title: "Success!",
          description: "Video successfully added.",
          variant: "success",
        });
      }
    } catch (error) {
      console.log("EXISTS", error);
    }
  });
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
            <CirclePlus class="mr-2 h-4 w-4" /> Add an album
          </Button>
        </div>
      </form>
    </UseTemplate>

    <Dialog v-if="isDesktop" v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline" @click="openDialog"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add an album
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
          ><CirclePlus class="mr-2 h-4 w-4" /> Add an album
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
