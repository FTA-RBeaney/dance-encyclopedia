<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { statuses, priorities } from "./../components/DataTable/data";
import { taskSchema } from "./../components/DataTable/schema";
import type { Task } from "./../components/DataTable/schema";

import {
  CircleHelp,
  Circle,
  Timer,
  CircleCheck,
  Ban,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Ellipsis,
  Signal,
  TrendingUp,
} from "lucide-vue-next";

import { toast } from "vue-sonner";

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();

interface DataTableRowActionsProps {
  row: Row<Task>;
}
const props = defineProps<DataTableRowActionsProps>();

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
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            class="flex h-4 w-4 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis class="h-4 w-4" />
            <span class="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[160px]">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <NuxtLink :to="`/artist/${row.original.artist}`">
                View artist
              </NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="$emit('expand')"> Expand </DropdownMenuItem>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ row.original.title }}</DialogTitle>
          <DialogDescription>
            {{ row.original.feedback }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
