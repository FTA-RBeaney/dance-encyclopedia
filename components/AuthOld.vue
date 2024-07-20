<script setup>
const supabase = useSupabaseClient();

const loading = ref(false);
const email = ref("");

const handleLogin = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signInWithOtp({ email: email.value });
    if (error) throw error;
    alert("Check your email for the login link!");
  } catch (error) {
    alert(error.error_description || error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form
    class="row flex-center flex justify-center"
    @submit.prevent="handleLogin"
  >
    <Card>
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl"> Create an account </CardTitle>
        <CardDescription>
          Sign in via magic link with your email below
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            class="inputField"
            placeholder="Your email"
            v-model="email"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          class="w-full"
          type="submit"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        >
          Create account
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
