<template>
  <section>
    <div class="w-6/12 mx-auto">
      <div
        class="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border my-6"
      >
        <div class="grid place-items-center h-full w-12 text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
          type="text"
          id="search"
          v-model="searchString"
          @input="search"
          placeholder="Search something.."
        />
      </div>
    </div>
    <div class="w-screen mx-auto">
      <Articles :results="results" />

      <div v-for="result in results.data" :key="result">
        {{ result.name }}
      </div>

      <Table>
        <TableCaption>A list of moves.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class=""> Move name </TableHead>
            <TableHead class=""> Tags </TableHead>
            <TableHead class="text-right"> Author </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="move in results.data" :key="move.name">
            <TableCell class="font-medium flex items-center">
              <img
                class="w-10 h-10 rounded mr-2"
                :src="move.image"
                alt="Default avatar"
              />

              {{ move.name }}
            </TableCell>
            <TableCell>
              <span
                v-for="tag in move.tags"
                :key="tag"
                class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1"
              >
                {{ tag }}
              </span>
            </TableCell>
            <TableCell class="font-medium flex items-center justify-end">
              <img
                class="w-10 h-10 rounded-full mr-2"
                :src="move.author_image"
                alt="Default avatar"
              />

              {{ move.author }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </section>
</template>

<script setup>
const searchString = ref("");
const results = ref([]);
const searching = ref(false);
const supabase = useSupabaseClient();

const search = async () => {
  searching.value = true;
  const res = await supabase
    .from("moves")
    .select()
    .textSearch("name", searchString.value | "");
  results.value = res;
  console.log(results.value);
  searching.value = false;
};
</script>
