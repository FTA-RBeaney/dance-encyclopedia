<template>
  <div>
    <Heading title="Profile" description="Your details" />
    <!-- <Account v-if="user" /> -->
    <Profile />
  </div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
