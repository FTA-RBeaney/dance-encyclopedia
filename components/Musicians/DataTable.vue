<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  ExpandedState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
} from "@tanstack/vue-table";
import { valueUpdater } from "@/lib/utils";

import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { h, ref } from "vue";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}>();

console.log("data", props.data);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const expanded = ref<ExpandedState>({});

const pageSizes = [5, 10, 20, 30, 40, 50];

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get expanded() {
      return expanded.value;
    },
  },
});

defineEmits<{
  (e: "expand"): void;
}>();
</script>

<template>
  <div>
    <div class="flex justify-between mb-4">
      <div
        class="relative flex items-center w-full max-w-80 h-10 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border"
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
          placeholder="Search..."
          :model-value="table.getColumn('name')?.getFilterValue() as string"
          @update:model-value="table.getColumn('name')?.setFilterValue($event)"
        />
      </div>
      <div>
        <Select @update:model-value="table.setPageSize">
          <SelectTrigger>
            <SelectValue placeholder="Artists per page" class="pr-2" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Number:</SelectLabel>
              <SelectItem
                :key="pageSize"
                v-for="pageSize in pageSizes"
                :value="pageSize"
              >
                {{ pageSize }} per page
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div class="mt-8">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <!-- <MusiciansDataRow
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </MusiciansDataRow> -->
              <TableRow
                :data-state="row.getIsSelected() ? 'selected' : undefined"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>

              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original.wiki_data.extract) }}
                </TableCell>
              </TableRow>
            </template>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>

      <div class="flex items-center justify-center py-4 mt-4 space-x-2">
        <Button
          variant="outline"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <!-- <Button
          :key="pageSize"
          v-for="pageSize in pageSizes"
          :value="pageSize"
          @click="handlePageSizeChange"
          >{{ pageSize }}</Button
        > -->
        <Button
          variant="outline"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
th button {
  padding: 0;
}
</style>
