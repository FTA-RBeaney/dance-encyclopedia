<script setup>
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();
import { useTimeAgo } from "@vueuse/core";
const props = defineProps({
  comment: Object,
  profiles: Object,
});

const timeAgo = useTimeAgo(props.comment.created_at);

const { data, error } = await supabase
  .from("post_comments")
  .select(`*,profiles(*)`)
  .eq("id", props.comment.id);
</script>
<template>
  <!-- comment listing section -->
  <div class="text-black p-4 antialiased flex">
    <img
      class="rounded-md h-8 w-8 mr-2 mt-1"
      :src="data[0].profiles.avatar_url"
      :alt="data[0].profiles.first_name"
    />
    <div>
      <div class="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
        <div class="font-semibold text-sm leading-relaxed">
          {{ data[0].profiles.first_name }}
        </div>
        <div class="text-xs leading-snug md:leading-normal">
          {{ data[0].content }}
        </div>
      </div>
      <div class="text-xs mt-1 text-gray-500">
        {{ timeAgo }}
      </div>
    </div>
  </div>
</template>
