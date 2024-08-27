<script setup>
import { ref } from "vue";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
const { $toast } = useNuxtApp();

// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");
const open = ref();
const isOpen = ref(false);
const mbid = ref("15ab8bb8-7348-4377-ab73-b7acdad1459c");
const spotify_id = ref();
const newArtistName = ref();
const alertMessage = ref("");
const artistExists = ref(false);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const checkArtist = async (id) => {
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
  var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${newArtistName.value}`;
  const { data: wikiInfo } = await useFetch(url);

  // then get the musicbrainz data
  const artistUrl = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels&fmt=json`;

  const { data: artistData, refresh: artistRefresh } = await useAsyncData(
    "artist",
    async () => {
      const { data } = await useFetch(artistUrl);
      return data;
    }
  );

  // get spotify embed link
  const filteredItems = artistData?.value.value.relations?.filter((item) => {
    if (item.url.resource.includes("spotify")) {
      return item.url.resource.includes("spotify");
    }
  });

  console.log(filteredItems);
  const artistSpotifyId = /[^/]*$/.exec(filteredItems[0].url.resource)[0];
  console.log(artistSpotifyId);

  try {
    const { data, error } = await supabase
      .from("musicians")
      .upsert({
        id: mbid,
        name: newArtistName.value,
        wiki_data: wikiInfo.value,
        spotify_id: artistSpotifyId,
      })
      .select();

    if (data != null) {
      $toast("This artist already exists!", {
        description: "Please try again with another Artist MBID" + error,
        variant: "destructive",
      });

      isOpen.value = false;
      await delay(1000);
      alertMessage.value = "";
      mbid = null;
      newArtistName.value = null;
      artistExists.value = false;
    } else {
      $toast("Success!", {
        description: "Artist successfully added.",
        variant: "success",
      });
      isOpen.value = false;
      await delay(1000);
      alertMessage.value = "";
      mbid = null;
      newArtistName.value = null;
    }
  } catch (error) {
    console.log("EXISTS", error);
  }
};
</script>

<template>
  <div>
    <Dialog v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline"> Add a musician </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a musician</DialogTitle>
          <DialogDescription>
            <div class="px-4">
              <ol class="list-decimal">
                <li>
                  Go
                  <a
                    href="https://musicbrainz.org"
                    target="_blank"
                    class="underline"
                    >here</a
                  >
                </li>
                <li>Search for an artist</li>
                <li>Click on their name</li>
                <li>Go to the details tab and then copy the MBID</li>
                <li>Paste it below:</li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
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
            <p class="text-md">{{ alertMessage }}</p>
            <Button v-if="!artistExists" type="submit" class="mt-2">
              Yes. Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
