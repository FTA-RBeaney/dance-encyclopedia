import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

import { labels, priorities, statuses } from "./../components/DataTable/data";
import type { Task } from "./../components/DataTable/schema";

import DataTableColumnHeader from "./ColumnHeader.vue";
import DataTableRowActions from "./RowActions.vue";

import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Title" }),

    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.type);

      return h("div", { class: "flex items-center space-x-2 " }, [
        label
          ? h(
              Badge,
              { variant: "outline", class: "rounded-md" },
              () => label.label
            )
          : null,

        h(
          "span",
          { class: "max-w-[500px] truncate font-medium" },
          row.getValue("title")
        ),
      ]);
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Status" }),

    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) return null;

      return h("div", { class: "flex w-[100px] items-center" }, [
        status.icon &&
          h(status.icon, { class: "mr-2 h-4 w-4 text-muted-foreground" }),
        h("span", status.label),
      ]);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Priority" }),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      );

      if (!priority) return null;

      return h("div", { class: "flex items-center" }, [
        priority.icon &&
          h(priority.icon, { class: "mr-2 h-4 w-4 text-muted-foreground" }),
        h("span", {}, priority.label),
      ]);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "created_by",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Created by" }),

    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return h("div", { class: "flex items-center space-x-2" }, [
        label ? h(Badge, { variant: "outline" }, () => label.type) : null,
        h("img", {
          class:
            "w-8 h-8 mr-2 rounded-md inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top",
          src: row.original.profiles.avatar_url,
        }),
        h(
          "span",
          {
            class: "max-w-[500px] truncate font-medium",
          },
          row.original.profiles.first_name
        ),
      ]);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
];
