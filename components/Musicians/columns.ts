import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./DataTableDropdown.vue";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

interface Musician {
  id: string;
  name: string;
  wiki_data: {
    lang: string;
  };
}

export const columns: ColumnDef<Musician>[] = [
  //   {
  //     accessorKey: "name",
  //     header: () => h("div", { class: "text-left" }, "Name"),
  //     cell: ({ row }: any) => {
  //       const name = row.getValue("name");

  //       var url = `https://en.wikipedia.org/api/rest_v1/page/summary/${name}`;
  //       const { data: wikiInfo } = await useFetch(url);

  //       return h("div", { class: "text-left font-medium" }, name);
  //     },
  //   },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(
        Button,
        {
          class: "text-left",
          variant: "link",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }: any) => {
      const name = row.getValue("name");
      console.log("row", row.original.wiki_data.thumbnail.source);
      return h("div", { class: "text-left font-medium" }, [
        h("img", {
          class:
            "w-10 h-10 mr-4 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 object-cover object-left-top",
          src: row.original.wiki_data.thumbnail.source,
        }),
        h("span", name),
      ]);
    },
  },
  //   {
  //     accessorKey: "type",
  //     header: ({ column }) => {
  //       return h(
  //         Button,
  //         {
  //           class: "text-left",
  //           variant: "link",
  //           onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
  //         },
  //         () => ["Type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
  //       );
  //     },
  //     cell: ({ row }: any) => {
  //       const type = row.getValue("type");
  //       const formatted = type.charAt(0).toUpperCase() + type.slice(1);
  //       return h("div", { class: "text-left font-medium" }, formatted);
  //     },
  //   },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const name = row.original;

      return h(
        "div",
        { class: "relative text-right" },
        h(DropdownAction, {
          name,
          onExpand: row.toggleExpanded,
        })
      );
    },
  },
  {
    id: "expand",
    enableHiding: false,
    cell: ({ row }) => {
      const name = row.original;

      return h(
        Button,
        {
          class: "text-right justify-self-end",
          variant: "link",
          onClick: () => row.toggleExpanded(),
        },
        () => ["Expand", h(ChevronDown, { class: "ml-2 h-4 w-4" })]
      );
    },
  },
];
