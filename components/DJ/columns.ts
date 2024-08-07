import { getCoreRowModel, type ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

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
    // cell: ({ row }) => {
    //   return h("div", { class: "flex items-center space-x-2 " }, [
    //     row.original.spotify_info.artists.map((item, i) =>
    //       h(
    //         "a",
    //         {
    //           class:
    //             "max-w-[500px] truncate font-sm border rounded-md px-2 py-1",
    //           href: `./artist/${item.name}`,
    //         },
    //         item.name
    //       )
    //     ),
    //     h("div", row.original),
    //   ]);
    // },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "created_by",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Created by" }),

    cell: ({ row }) => {
      return h("div", { class: "flex items-center space-x-2" }, [
        // h("img", {
        //   class:
        //     "w-6 h-6 mr-1 rounded-md inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top",
        //   src: row.original.profiles.avatar_url,
        // }),
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
