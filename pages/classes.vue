<script setup>
import { data } from "../data/classes";

const categories = ref(["weeks", "months"]);
const currentCategory = ref("weeks");
</script>

<template>
  <div>
    <Heading title="Classes" description="Information on class attendance" />

    <main>
      <Tabs default-value="weeks">
        <TabsList>
          <TabsTrigger
            :value="category"
            v-for="(category, index) in categories"
            :key="index"
          >
            {{ category }}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          v-for="(category, index) in categories"
          :value="category"
          :key="index"
        >
          <LineChart
            :data="data[category]"
            index="name"
            :categories="['total']"
            :colors="['green']"
          />

          <Table class="w-10/12 mx-auto my-6">
            <TableHeader>
              <TableRow>
                <TableHead class="font-bold"> Date </TableHead>
                <TableHead class="font-bold text-right">
                  Number of people
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in data[category]" :key="item.name">
                <TableCell class="font-medium w-3/12">
                  {{ item.name }}
                </TableCell>
                <TableCell class="font-medium text-right">
                  {{ item.total }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
