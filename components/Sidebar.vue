<script setup>
import { playlists } from "../data/playlists";
import { RealtimeChannel } from "@supabase/supabase-js";
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

let realtimeChannel = RealtimeChannel;

const { data: loggedInUser, error } = await supabase
  .from("profiles")
  .select()
  .eq("id", supabaseUser.value.id);

// check favourites table
const { data: favourites, refresh: refreshFavourites } = await useAsyncData(
  "favourites",
  async () => {
    const { data } = await supabase
      .from("favourites")
      .select(
        `
    *,
      musicians(
        *
      )
    `
      )
      .eq("user_id", supabaseUser.value.id);

    return data;
  }
);

onMounted(() => {
  realtimeChannel = supabase
    .channel("public:favourites")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "favourites" },
      () => refreshFavourites()
    );
  realtimeChannel.subscribe();
});

onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});
</script>

<template>
  <div class="pb-12 lg:block">
    <div class="space-y-4 py-4">
      <div class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Discover</h2>
        <div class="space-y-1">
          <!-- <NuxtLink to="/moves">
            <Button variant="ghost" class="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="mr-2 h-4 w-4"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Browse
            </Button>
          </NuxtLink> -->

          <NuxtLink to="/videos">
            <Button variant="ghost" class="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Watch
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Library</h2>
        <div class="space-y-1">
          <!-- <Button variant="ghost" class="w-full justify-start">
            <IconsPlaylist />
            Playlists
          </Button> -->
          <!-- <Button variant="ghost" class="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="mr-2 h-4 w-4"
            >
              <circle cx="8" cy="18" r="4" />
              <path d="M12 18V2l7 4" />
            </svg>
            Songs
          </Button> -->
          <NuxtLink to="/dancers">
            <Button variant="ghost" class="w-full justify-start">
              <IconsPerson />
              Dancers
            </Button>
          </NuxtLink>
          <NuxtLink to="/musicians">
            <Button variant="ghost" class="w-full justify-start">
              <IconsMicrophone />
              Musicians
            </Button>
          </NuxtLink>
          <!-- <Button variant="ghost" class="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="mr-2 h-4 w-4"
            >
              <path d="m16 6 4 14" />
              <path d="M12 6v14" />
              <path d="M8 8v12" />
              <path d="M4 4v16" />
            </svg>
            Albums
          </Button> -->
        </div>
      </div>
      <div v-if="loggedInUser[0].role === 'admin'" class="px-3 py-2">
        <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
          Sunshine Swing
        </h2>
        <div class="space-y-1">
          <NuxtLink to="/classes">
            <Button variant="ghost" class="w-full justify-start">
              <svg
                class="mr-2 h-4 w-4"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Classes
            </Button>
          </NuxtLink>
          <NuxtLink to="/google">
            <Button variant="ghost" class="w-full justify-start">
              <svg
                class="mr-2 h-4 w-4"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1C5 0.447715 5.44772 0 6 0H9C9.55228 0 10 0.447715 10 1V2H14C14.5523 2 15 2.44772 15 3V6C15 6.8888 14.6131 7.68734 14 8.23608V11.5C14 12.3284 13.3284 13 12.5 13H2.5C1.67157 13 1 12.3284 1 11.5V8.2359C0.38697 7.68721 0 6.88883 0 6V3C0 2.44772 0.447716 2 1 2H5V1ZM9 1V2H6V1H9ZM1 3H5H5.5H9.5H10H14V6C14 6.654 13.6866 7.23467 13.1997 7.6004C12.8655 7.85144 12.4508 8 12 8H8V7.5C8 7.22386 7.77614 7 7.5 7C7.22386 7 7 7.22386 7 7.5V8H3C2.5493 8 2.1346 7.85133 1.80029 7.60022C1.31335 7.23446 1 6.65396 1 6V3ZM7 9H3C2.64961 9 2.31292 8.93972 2 8.82905V11.5C2 11.7761 2.22386 12 2.5 12H12.5C12.7761 12 13 11.7761 13 11.5V8.82915C12.6871 8.93978 12.3504 9 12 9H8V9.5C8 9.77614 7.77614 10 7.5 10C7.22386 10 7 9.77614 7 9.5V9Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Workshop
            </Button>
          </NuxtLink>
        </div>
      </div>
      <div v-if="favourites.length > 0" class="py-2">
        <h2 class="relative px-7 text-lg font-semibold tracking-tight">
          Favourites
        </h2>
        <ScrollArea class="h-[300px] px-1">
          <div class="space-y-1 p-2">
            <NuxtLink
              v-for="(favourite, i) in favourites"
              :key="`${favourite}-${i}`"
              :to="`/artist/${favourite.musicians.id}`"
            >
              <Button variant="ghost" class="w-full justify-start font-normal">
                <IconsPlaylist />
                {{ favourite.musicians.name }}
              </Button>
            </NuxtLink>
          </div>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.router-link-active {
  button {
    background-color: hsl(var(--accent));
  }
}
</style>
