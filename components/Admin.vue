<script setup lang="ts">
import { firstNavigation } from "../data/navigation";
import * as lucideIcons from "lucide-vue-next";
import { useMagicKeys } from "@vueuse/core";
const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();
const open = ref(false);
const favourites = ref();

const { data } = await supabase
  .from("favourites")
  .select("*")
  .eq("user_id", supabaseUser.value.id)
  .eq("type", "artist");

favourites.value = data;

const { Meta_J, Ctrl_J } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "j" && (e.metaKey || e.ctrlKey)) e.preventDefault();
  },
});

watch([Meta_J, Ctrl_J], (v) => {
  if (v[0] || v[1] || v[2]) handleOpenChange();
});

function handleOpenChange() {
  open.value = !open.value;
}

const inputLength = computed(() => favourites.value.length);
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Access your favourites by pressing
      <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
      >
        <span class="text-xs">⌘</span>J
      </kbd>
    </p>
    <CommandDialog v-model:open="open">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            v-for="(item, i) in firstNavigation"
            :key="`nav${i}`"
            :value="item.title"
            @select="
              (ev) => {
                $router.push(item.path);
                open = false;
              }
            "
          >
            <component :is="lucideIcons[item.icon]" class="mr-2 w-4 h-4" />
            {{ item.title }}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup v-if="inputLength > 0" heading="Favourites">
          <CommandItem
            v-for="(favourite, i) in favourites"
            :key="`fave${i}`"
            :value="favourite.name"
            :ref="ref"
            @select="
              (ev) => {
                $router.push(`/artist/${favourite.post_id}`);
                open = false;
              }
            "
          >
            <IconsPerson class="mr-2 h-4 w-4" /><span>{{
              favourite.name
            }}</span></CommandItem
          >
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>
