import { getCoreRowModel, type ColumnDef } from "@tanstack/vue-table";
import { h, defineEmits } from "vue";

import DataTableColumnHeader from "./../components/DataTable/ColumnHeader.vue";
import DataTableRowActions from "./../components/DJ/RowActions.vue";

import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

let gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "created_by",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created By", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },

    cell: ({ row }) => {
      const created_by = row.getValue("created_by");
      return h("div", { class: "flex items-center space-x-2 " }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium cursor-pointer" },
          created_by
        ),
      ]);
    },
  },
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
        () => ["Description", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },

    cell: ({ row }) => {
      const name = row.getValue("name");
      return h("div", { class: "flex items-center space-x-2 " }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium cursor-pointer" },
          name
        ),
      ]);
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Amount", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },

    cell: ({ row }) => {
      const amount = row.getValue("amount");
      return h("div", { class: "flex items-center space-x-2 " }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium" },
          gbp.format(amount)
        ),
      ]);
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type");
      return h("div", { class: "flex items-center space-x-2 " }, [
        h("span", { class: "max-w-[500px] truncate font-medium" }, type),
      ]);
    },
  },
  {
    accessorKey: "approved",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "link",
          class: "p-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Approved?", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },

    cell: ({ row }) => {
      const approved = row.getValue("approved");
      return h("div", { class: "flex items-center space-x-2" }, [
        h(
          "span",
          {
            class: "max-w-[500px] truncate font-medium",
          },
          approved
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
