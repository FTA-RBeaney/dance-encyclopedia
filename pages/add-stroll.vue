<template>
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
</template>
