<script setup>
const supabase = useSupabaseClient();
import tasks from "./../components/DataTable/tasks.json";
import { columns } from "./../components/DataTable/columns";

const { data } = await supabase
  .from("feedback")
  .select(`*,profiles(*)`)
  .order("status", { ascending: false });
</script>

<template>
  <div>
    <Card class="p-4 max-w-lg">
      <Tabs default-value="stroll" class="w-full">
        <TabsList>
          <TabsTrigger value="stroll"> Stroll </TabsTrigger>
          <TabsTrigger value="password"> Password </TabsTrigger>
          <TabsTrigger value="other"> Other </TabsTrigger>
        </TabsList>
        <TabsContent value="stroll">
          <AddStroll />
        </TabsContent>
        <TabsContent value="password"> Change your password here. </TabsContent>
        <TabsContent value="other"> Other here. </TabsContent>
      </Tabs>
    </Card>
  </div>
</template>
