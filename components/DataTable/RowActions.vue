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

const task = computed(() => taskSchema.parse(props.row.original));

const status = ref();
const priority = ref();

const { data: isAdmin, error } = await supabase
  .from("profiles")
  .select("is_admin")
  .eq("id", supabaseUser?.value?.id);

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

async function onUpdate(id, column, columnValue) {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .update({ [column]: columnValue })
      .eq("id", id);

    toast("Task updated", {
      description: "Task updated",
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
            class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis class="h-4 w-4" />
            <span class="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[160px]">
          <DropdownMenuGroup>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <span>View details</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub v-if="isAdmin">
            <DropdownMenuSubTrigger>
              <TrendingUp class="mr-2 h-4 w-4" />
              <span>Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup v-model="status">
                  <DropdownMenuRadioItem
                    @click="onUpdate(row.original.id, 'status', status)"
                    v-for="label in statuses"
                    :key="label.value"
                    :value="label.value"
                    class="pl-2"
                  >
                    <component :is="label.icon" class="mr-2 w-4 h-4" />
                    {{ label.label }}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub v-if="isAdmin">
            <DropdownMenuSubTrigger>
              <Signal class="mr-2 h-4 w-4" />
              <span>Priority</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup v-model="priority">
                  <DropdownMenuRadioItem
                    @click="onUpdate(row.original.id, 'priority', priority)"
                    v-for="label in priorities"
                    :key="label.value"
                    :value="label.value"
                    class="pl-2"
                  >
                    <component :is="label.icon" class="mr-2 w-4 h-4" />
                    {{ label.label }}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
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
