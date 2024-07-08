<template>
  <div>
    <Heading title="Playlist title" description="count.description" />
    <ul>
      <li v-for="item in data" :key="item.post_id">
        <NuxtLink :to="`/artist/${item.musicians.id}`">
          {{ item.musicians.name }}
        </NuxtLink>
      </li>
    </ul>
    <pre>
    {{ data }}
  </pre
    >
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
// check favourites table
const { data, error } = await supabase
  .from("favourites")
  .select(
    `
    *,
      musicians(
        *
      )
    `
  )
  .eq("user_id", user.value.id);
</script>
