<script setup>
const props = defineProps({
  filteredItems: Object,
});

const { artistId, trackId } = toRefs(props);
</script>

<template>
  <div class="flex">
    <div class="w-5/12 max-w-screen-md">
      <img class="w-full rounded-md" :src="filteredItems.images[0].url" />
      <Card class="mt-4">
        <CardHeader>
          <CardTitle>Album info </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>{{ filteredItems.name }}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Release date</TableCell>
                <TableCell>{{ filteredItems.release_date }}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>No. of tracks</TableCell>
                <TableCell>{{ filteredItems.tracks.items.length }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- <pre>{{ filteredItems }}</pre> -->
    </div>
    <div class="w-7/12 ml-4 max-w-screen-md">
      <Card>
        <CardHeader>
          <CardTitle> Track listing: </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Spotify ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="(track, i) in filteredItems.tracks.items"
                :key="`track${i}`"
              >
                <TableCell>
                  {{ i + 1 }}.
                  {{ track.name }}
                </TableCell>
                <TableCell>
                  {{ track.id }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <!-- <div
      v-for="(rec, i) in filteredItems"
      :key="`rec${i}`"
      class="flex truncate mb-2"
    >
      <img
        class="w-10 h-10 object-cover rounded-lg mr-0"
        alt="User avatar"
        :src="rec.album.images[0].url"
      />
      <Button
        variant="link"
        @click="$emit('changeTrack', rec, rec.album.images[0].url)"
        >{{ rec.name }}</Button
      >
    </div> -->
      </Card>
    </div>
  </div>
</template>
