<script setup>
const { auth } = useSupabaseClient();
const supabaseUser = useSupabaseUser();

const supabase = useSupabaseClient();

const loading = ref(true);
const username = ref("");
const website = ref("");
const avatar_path = ref("");

loading.value = true;
const user = useSupabaseUser();

const { data } = await supabase
  .from("profiles")
  .select(`username, website, avatar_url`)
  .eq("id", user.value.id)
  .single();

if (data) {
  username.value = data.username;
  website.value = data.website;
  avatar_path.value = data.avatar_url;
  console.log(data);
}

loading.value = false;

async function updateProfile() {
  try {
    loading.value = true;
    const user = useSupabaseUser();

    const updates = {
      id: user.value.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_path.value,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function userLogout() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    await navigateTo("/login");
    loading.value = false;
  }
}
</script>

<template>
  <form class="form-widget w-7/12 mx-auto" @submit.prevent="updateProfile">
    <Card>
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl"> Edit your account </CardTitle>
        <CardDescription> Change your details below </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <Avatar v-model:path="avatar_path" @upload="updateProfile" />
        <div>
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="text"
            class="inputField"
            placeholder="Your email"
            :value="username"
            disabled
          />
        </div>
        <div>
          <Label for="username">Username</Label>
          <Input
            id="username"
            type="text"
            class="inputField"
            placeholder="Your username"
            v-model="username"
          />
        </div>
        <div>
          <Label for="website">Website</Label>
          <Input
            id="website"
            type="url"
            class="inputField"
            placeholder="Your website"
            v-model="website"
          />
        </div>

        <div>
          <Button
            class="w-full"
            type="submit"
            :value="loading ? 'Loading ...' : 'Update'"
            :disabled="loading"
            variant="outline"
          >
            Update
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          class="w-full"
          type="submit"
          @click="userLogout"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        >
          Sign Out
        </Button>
        <p v-if="supabaseUser"></p>
      </CardFooter>
    </Card>
  </form>
</template>
