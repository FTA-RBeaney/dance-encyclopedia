import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./DataTableDropdown.vue";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

interface Favourite {
  id: string;
  name: string;
  type: "artist" | "song";
}

export const columns: ColumnDef<Favourite>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Name"),
    cell: ({ row }: any) => {
      const name = row.getValue("name");
      return h("div", { class: "text-left font-medium" }, name);
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return h(
        Button,
        {
          class: "text-left",
          variant: "link",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }: any) => {
      const type = row.getValue("type");
      const formatted = type.charAt(0).toUpperCase() + type.slice(1);
      return h("div", { class: "text-left font-medium" }, formatted);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const name = row.original;

      return h("div", { class: "relative" }, h(DropdownAction, {}));
    },
  },
];
