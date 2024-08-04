<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { labels } from "./../components/DataTable/data";
import { taskSchema } from "./../components/DataTable/schema";
import type { Task } from "./../components/DataTable/schema";
import { Ellipsis } from "lucide-vue-next";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";

const supabase = useSupabaseClient();

interface DataTableRowActionsProps {
  row: Row<Task>;
}
const props = defineProps<DataTableRowActionsProps>();

const task = computed(() => taskSchema.parse(props.row.original));

async function onDelete(id) {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .delete()
      .eq("id", id);

    toast("Task deleted", {
      description: "Task deleted",
    });

    if (error) throw error;
  } catch (error) {
    toast("There was an error", {
      title: "There was an error",
      description: error,
    });
  } finally {
  }
}
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis class="h-4 w-4" />
          <span class="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-[160px]">
        <!-- <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Make a copy</DropdownMenuItem>
      <DropdownMenuItem>Favorite</DropdownMenuItem>
      <DropdownMenuSeparator /> -->
        <!-- <DropdownMenuSub>
        <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup :value="task.label">
            <DropdownMenuRadioItem
              v-for="label in labels"
              :key="label.value"
              :value="label.value"
            >
              {{ label.label }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub> -->
        <!-- <DropdownMenuSeparator /> -->
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            @click="onDelete(row.original.id)"
            class="w-full"
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Toaster />
  </div>
</template>
