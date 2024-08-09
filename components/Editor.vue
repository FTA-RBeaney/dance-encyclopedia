<template>
  <div>
    <Card v-if="typedInfo.blocks.length > 0 && !isToggled" class="p-4">
      <div v-for="(block, i) in typedInfo?.blocks" :key="`block${i}`">
        <h2 class="py-2 text-xl font-semibold" v-if="block.type === 'header'">
          {{ block.data.text }}
        </h2>
        <p v-if="block.type === 'paragraph'" class="mb-3">
          {{ block.data.text }}
        </p>
      </div>
      <Button class="mt-4" @click="toggle">Edit</Button>
    </Card>

    <Card v-if="typedInfo.blocks.length === 0 && !isToggled" class="p-4">
      <Button @click="toggle">Add dancer information</Button></Card
    >
    <Toaster />

    <Card v-show="isToggled" class="p-4">
      <div id="editor"></div>
      <Button @click="saveData">Save</Button>
    </Card>
  </div>
</template>

<script setup>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

const client = useSupabaseClient();
const isToggled = ref(false);

const props = defineProps({
  dancerId: String,
});

let editor;
let description;
const typedInfo = ref();

const { data, refresh } = await useAsyncData("info", async () => {
  const { data, error } = await client
    .from("dancers")
    .select()
    .eq("id", props.dancerId)
    .limit(1)
    .single();

  typedInfo.value = data.info;
});

const toggle = () => {
  isToggled.value = !isToggled.value;
};

onMounted(() => {
  editor = new EditorJS({
    holder: "editor",
    autofocus: true,
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
    },
    data: typedInfo.value,
  });
});

const saveData = () => {
  editor
    .save()
    .then(async (outputData) => {
      typedInfo.value = outputData;

      const { data } = await client
        .from("dancers")
        .update({ info: outputData })
        .eq("id", props.dancerId);
    })
    .catch((error) => {
      console.log("Saving failed: ", error);
    });

  isToggled.value = false;

  toast("Article updated", {
    description: "The article has been updated",
  });
};
</script>

<style>
.ce-header {
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin: 0;
}
.cdx-block {
  padding: 0;
}

.ce-paragraph.cdx-block {
  margin-bottom: 0.75rem;
}

.codex-editor__redactor {
  padding-bottom: 20px !important;
}
</style>
