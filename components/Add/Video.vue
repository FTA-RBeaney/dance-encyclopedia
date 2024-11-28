<script lang="ts" setup>
  import { ref } from "vue";
  import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
  import { CirclePlus } from "lucide-vue-next";
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm } from "vee-validate";
  import { h } from "vue";
  import { z } from "zod";

  // Reuse `form` section
  const [UseTemplate, GridForm] = createReusableTemplate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const open = ref();
  const isOpen = ref(false);
  const newArtistName = ref();
  const alertMessage = ref("");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const formSchema = toTypedSchema(
    z.object({
      url: z.string(),
      start: z.string(),
      end: z.string(),
      tags: z.array(z.string()).min(1).max(3),
    })
  );

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      tags: [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(JSON.stringify(values, null, 2));
    const supabase = useSupabaseClient();
    const supabaseUser = useSupabaseUser();

    try {
      const { data, error } = await supabase
        .from("videos")
        .upsert(
          {
            created_by: supabaseUser.value.id,
            url: values.url,
            user_id: supabaseUser.value.id,
            start: values.start,
            end: values.end,
            tags: values.tags,
          },
          { onConflict: "id" }
        )
        .select();

      if (data === null) {
        push.error("This video already exists");

        isOpen.value = false;
        await delay(1000);
        alertMessage.value = "";
        url = null;
      } else {
        push.success("Video successfully added!");
        isOpen.value = false;
        await delay(1000);
        alertMessage.value = "";
        url = null;
        newArtistName.value = null;
      }
    } catch (error) {
      console.log("EXISTS", error);
    }

    toast({
      title: "You submitted the following values:",
      description: h(
        "pre",
        { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
        h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
      ),
    });
  });
</script>

<template>
  <div>
    <UseTemplate>
      <form
        @submit.prevent="onSubmit"
        class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <FormField
            v-slot="{ componentField }"
            name="url">
            <FormItem>
              <FormLabel>Youtube URL</FormLabel>
              <FormControl>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=w-1YJyi0wag"
                  v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <FormField
                v-slot="{ componentField }"
                name="start">
                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <FormControl>
                    <Input
                      id="start"
                      type="text"
                      placeholder="0"
                      v-bind="componentField" />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>
            <div>
              <FormField
                v-slot="{ componentField }"
                name="end">
                <FormItem>
                  <FormLabel>End time</FormLabel>
                  <FormControl>
                    <Input
                      id="end"
                      type="text"
                      placeholder="10"
                      v-bind="componentField" />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>
          </div>
          <div>
            <FormField
              v-slot="{ componentField }"
              name="tags">
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagsInput :model-value="componentField.modelValue">
                    <TagsInputItem
                      v-for="item in componentField.modelValue"
                      :key="item"
                      :value="item">
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>

                    <TagsInputInput placeholder="Tags..." />
                  </TagsInput>
                </FormControl>
                <FormDescription> Select your tags. </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <Button
            type="submit"
            class="mt-6">
            <CirclePlus class="mr-2 h-4 w-4" /> Add a video
          </Button>
        </div>
      </form>
    </UseTemplate>

    <Dialog
      v-if="isDesktop"
      v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button
          variant="outline"
          @click="open = true"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a video
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a video</DialogTitle>
          <DialogDescription> Add the URL below </DialogDescription>
        </DialogHeader>
        <GridForm />
      </DialogContent>
    </Dialog>

    <Drawer
      v-else
      v-model="open"
      v-model:open="isOpen">
      <DrawerTrigger as-child>
        <Button
          variant="outline"
          @click="open = true"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a video
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="text-left">
          <DrawerTitle>Add a video</DrawerTitle>
          <DrawerDescription> Add the URL below </DrawerDescription>
        </DrawerHeader>
        <GridForm />
        <DrawerFooter class="pt-2">
          <DrawerClose as-child>
            <Button variant="outline"> Cancel </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
