import { getCoreRowModel, type ColumnDef } from "@tanstack/vue-table";
import { h, defineEmits } from "vue";

import DataTableColumnHeader from "./../components/DataTable/ColumnHeader.vue";
import DataTableRowActions from "./../components/DJ/RowActions.vue";

import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
  },
  {
    accessorKey: "album_name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Album", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },

    cell: ({ row }) => {
      const album = row.getValue("album_name");
      return h("div", { class: "flex items-center space-x-2 " }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium cursor-pointer" },
          album
        ),
      ]);
    },
  },
  {
    accessorKey: "bpm",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["BPM", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },

    cell: ({ row }) => {
      return h("div", { class: "flex items-center space-x-2 " }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium" },
          row.original.bpm
        ),
      ]);
    },
  },
  {
    accessorKey: "artist",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Artist", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const artist = row.getValue("artist");
      return h("div", { class: "flex items-center space-x-2 " }, [
        h("span", { class: "max-w-[500px] truncate font-medium" }, artist),
      ]);
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "duration",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Duration" }),

    cell: ({ row }) => {
      return h("div", { class: "flex items-center space-x-2" }, [
        h(
          "span",
          {
            class: "max-w-[500px] truncate font-medium",
          },
          (Math.round((row.original.duration / 60) * 100) / 100).toFixed(2)
        ),
      ]);
    },
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(DataTableRowActions, { row, onExpand: row.toggleExpanded }),
  },
];
