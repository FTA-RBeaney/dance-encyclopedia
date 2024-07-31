<template>
  <div>
    <p class="pb-2 text-xl font-semibold">Latest legends:</p>
    <p class="text-sm italic">
      {{ onlineUsers }}
      {{ onlineUsers.length > 1 ? "users" : "user" }} online
    </p>
    <Table v-if="listOfUsers">
      <TableBody>
        <TableRow v-for="(user, index) in listOfUsers" :key="`item${index}`">
          <TableCell class="px-0">
            <div class="flex justify-start items-center">
              <img
                v-if="user.avatar_url"
                class="aspect-square object-cover rounded-full w-8 h-8 mr-3"
                :src="user.avatar_url"
                format="webp"
                preload
                loading="lazy"
                placeholder="https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png"
                :alt="user.first_name"
              />
              <div
                v-else
                class="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-3"
              >
                <svg
                  class="absolute w-10 h-10 text-gray-400 -left-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="truncate max-w-[110px]">
                {{ user.first_name || user.email }}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div v-if="isOnline(user.id)" class="flex items-center justify-end">
              <div
                class="bg-green-400 rounded-full w-2 h-2 mr-2 animate-pulse"
              ></div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup>
const supabaseUser = useSupabaseUser();
const supabase = useSupabaseClient();

const listOfUsers = ref([]);
const userIds = ref([]);

const { data: users } = await supabase.from("profiles").select();
listOfUsers.value = users;

// create a channel to detect changes on people being online or offline
const channel = supabase.channel("room1");
channel
  .on("presence", { event: "sync" }, () => {
    for (const id in channel.presenceState()) {
      userIds.value.push(channel.presenceState()[id][0].user_id);
    }
  })
  .subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel.track({
        online_at: new Date().toISOString(),
        user_id: supabaseUser?.value.id,
      });
    }
  });

// calculate the number of online users
const onlineUsers = computed(() => {
  return [...new Set(userIds.value)].length;
});

// detect if a user is online
const isOnline = (id) => {
  if (userIds.value.includes(id)) {
    return true;
  }
};

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>
