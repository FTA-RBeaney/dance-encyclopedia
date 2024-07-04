<template>
  <div>
    <Heading title="Account" description="Login to your account" />
    <Account v-if="user" />
  </div>
</template>

<script setup>
const user = useSupabaseUser();
console.log("user", user.value);
</script>
