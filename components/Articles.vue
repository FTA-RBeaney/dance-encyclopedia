<template>
  <div class="px-4">
    <!-- <div
      class="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex"
    >
      <button
        v-if="isToggled"
        @click="toggleListView"
        class="inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 active"
        id="grid"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="fill-current w-4 h-4 mr-2"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Grid</span>
      </button>
      <button
        v-else
        @click="toggleListView"
        class="inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full px-4 py-2"
        id="list"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="fill-current w-4 h-4 mr-2"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        <span>List</span>
      </button>
    </div> -->
    <ais-instant-search
      :index-name="indexName"
      :search-client="algolia"
      :insights="true"
    >
      <ais-search-box placeholder="Search for moves...">
        <template v-slot="{ currentRefinement, refine }">
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
                placeholder="Search something.."
                :value="currentRefinement"
                @input="refine($event.currentTarget.value)"
              />
            </div>
          </div>
        </template>
      </ais-search-box>
      <ais-hits>
        <template v-slot="{ items }">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="font-bold"> Name </TableHead>
                <TableHead class="font-bold"> Author </TableHead>
                <TableHead class="font-bold text-right"> Tags </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in items" :key="item.name">
                <TableCell class="font-medium w-3/12">
                  <!-- <img
                    class="w-12 h-12 rounded mr-2"
                    :src="item.image"
                    alt="Default avatar"
                  /> -->

                  {{ item.name }}
                </TableCell>
                <TableCell class="font-medium">
                  <div class="flex items-center">
                    <img
                      class="w-8 h-8 rounded-full mr-2"
                      :src="item.author_image"
                      alt="Default avatar"
                    />

                    {{ item.author }}
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1"
                  >
                    {{ tag }}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </template>
      </ais-hits>
      <hr />

      <!-- Artists search results -->
      <ais-index index-name="artists">
        <ais-hits>
          <template v-slot="{ items }">
            <Table>
              <TableBody>
                <TableRow v-for="item in items" :key="item.name">
                  <TableCell class="font-medium w-3/12">
                    <!-- <img
                      class="w-12 h-12 rounded mr-2"
                      :src="item.image"
                      alt="Default avatar"
                    /> -->

                    {{ item.name }}
                  </TableCell>
                  <TableCell class="font-medium">
                    <div class="flex items-center">
                      <img
                        class="w-8 h-8 rounded-full mr-2"
                        :src="item.author_image"
                        alt="Default avatar"
                      />

                      {{ item.author }}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-indigo-600 bg-indigo-200 uppercase last:mr-0 mr-1"
                    >
                      {{ tag }}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </template>
        </ais-hits>
      </ais-index>
    </ais-instant-search>
  </div>
</template>

<script setup lang="ts">
import {
  AisInstantSearch,
  AisSearchBox,
  AisHits,
  AisIndex,
} from "vue-instantsearch/vue3/es";

const indexName = "moves";
const algolia = useAlgoliaRef();

defineProps({
  moves: {
    type: Object,
  },
});

const isToggled = ref(false);

const toggleListView = () => {
  isToggled.value = !isToggled.value;
};
</script>

<style lang="scss">
.list-view {
  display: block;

  .article-card {
    display: flex;
    margin-bottom: 2rem;
  }

  .card-image {
    width: 200px;
  }
}
</style>
