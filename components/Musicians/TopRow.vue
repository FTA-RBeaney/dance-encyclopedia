<script setup>
const supabase = useSupabaseClient();

const props = defineProps({
  artist: Object,
});

const artistData = ref();

const { data, refresh: wikiRefresh } = await useAsyncData(
  `topArtists${props.artist.name}`,
  async () => {
    const { data, error } = await supabase
      .from("musicians")
      .select("*")
      .eq("id", props.artist.post_id)
      .limit(1)
      .single();

    return data;
  }
);
</script>

<template>
  <div class="border-b py-4 last:border-b-0 last:pb-0">
    <!-- <pre>{{ data }}</pre> -->
    <div class="flex items-center flex-stack">
      <!--begin::Symbol-->
      <div
        class="rounded-full overflow-hidden aspect-square w-14 shrink-0 symbol-circle symbol-60px mr-4"
      >
        <img :src="data.wiki_data.thumbnail.source" class="" alt="" />
      </div>
      <!--end::Symbol-->

      <!--begin::Section-->
      <div class="flex items-center justify-between flex-wrap w-full">
        <!--begin:Author-->
        <div class="me-2">
          <a
            href="/metronic8/demo55/pages/user-profile/overview.html"
            class="text-gray-800 text-hover-primary text-lg font-semibold"
            >{{ artist.name }}</a
          >

          <!-- <p class="text-gray-500 font-medium block fs-6 truncate">
            {{ artistData?.wiki_data?.description }}
          </p> -->
        </div>
        <!--end:Author-->

        <!--begin::Follow-->
        <Button
          class="btn btn-sm btn-light-primary py-2 px-4 fs-7 fs-bolder"
          data-kt-element="follow"
        >
          View
        </Button>
        <!--end::Follow-->
      </div>
      <!--end::Section-->
    </div>
  </div>
</template>
