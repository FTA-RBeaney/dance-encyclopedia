import { getCoreRowModel, type ColumnDef } from "@tanstack/vue-table";
import { h, defineEmits } from "vue";

import DataTableColumnHeader from "./../components/DataTable/ColumnHeader.vue";
import DataTableRowActions from "./../components/DJ/RowActions.vue";

import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-vue-next";
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

    cell: ({ row }) => {
      const name = row.getValue("name");
      return h(
        Button,
        {
          class: "text-right justify-self-end",
          variant: "ghost",
          onClick: () => row.toggleExpanded(),
        },
        () => [
          name,
          row.getIsExpanded()
            ? h(ChevronUp, { class: "ml-2 h-4 w-4" })
            : h(ChevronDown, { class: "ml-2 h-4 w-4" }),
        ]
      );
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
    id: "actions",
    cell: ({ row }) =>
      h(DataTableRowActions, { row, onExpand: row.toggleExpanded }),
  },
];
