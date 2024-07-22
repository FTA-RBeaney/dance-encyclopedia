<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Images</h2>
        <p class="text-sm text-muted-foreground">Various images</p>
      </div>
    </div>
    <Separator class="my-4" />
    <div>
      <ScrollArea class="w-[100%] whitespace-nowrap">
        <div class="flex space-x-4">
          <div
            v-for="(media, index) in artistImages"
            :key="`wikimedia-${index}`"
            class="shrink-0"
          >
            <div>
              <Dialog>
                <DialogTrigger v-if="media?.srcset">
                  <div class="overflow-hidden rounded-md">
                    <img
                      :src="media.srcset[0].src"
                      class="aspect-[3/4] h-64 w-fit object-cover"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent class="w-auto">
                  <img
                    :src="media.srcset[0].src"
                    class="aspect-[3/4] h-94 w-fit sm:min-w-[425px] object-cover"
                  />
                  <Label v-if="media.caption" class="text-center">{{
                    media.caption.text
                  }}</Label>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  artistName: String,
});

const { artistName } = props;
const artistImages = ref([]);

// check for images
const artistNameTrimmed = artistName
  .trim()
  .replace(/'/g, "%27")
  .replace(/ /g, "_");
const mediaUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${artistNameTrimmed}`;

try {
  const { data: images, error: imageError } = useFetch(mediaUrl);
  console.log("images", images.value);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  artistImages.value = images.value.items.filter(function (obj) {
    return obj.type === "image";
  });
} catch (error) {
  console.log(error.message);
}
</script>
