<template>
  <div>
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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  artistImages.value = images.value.items.filter(function (obj) {
    return obj.type === "image";
  });
} catch (error) {
  console.log(error.message);
}
</script>
