<script setup lang="ts">
import { MoreHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

function copy(id: string) {
  navigator.clipboard.writeText(id);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <!-- <DropdownMenuItem @click="copy(payment.id)"> Copy link </DropdownMenuItem> -->
      <DropdownMenuSeparator />
      <DropdownMenuItem>View page</DropdownMenuItem>
      <DropdownMenuItem class="text-destructive"
        >Delete favourite</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>
