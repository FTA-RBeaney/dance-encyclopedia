<template>
  <div>
    <Heading title="Account" description="Your account" />
    <Account v-if="user" />
  </div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
