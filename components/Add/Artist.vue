<script setup>
import { h } from "vue";
import { CirclePlus, Calendar as CalendarIcon } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";

const { $toast } = useNuxtApp();
const supabase = useSupabaseClient();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    spotify_id: z.string().min(2).max(50),
  })
);

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {},
});

const onSubmit = handleSubmit(async (values) => {

  try {
    const { data, error } = await supabase
      .from("musicians")
      .upsert({
        name: values.name,
        wiki_data: ,
        spotify_id: values.spotify_id
      })
      .select();

    $toast("You submitted the following values:", {
      description: h(
        "pre",
        { class: "mt-2 w-full rounded-md bg-slate-950 p-4" },
        h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
      ),
    });
    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("EXISTS", error);
  } finally {
    handleRefresh();
  }
});

const emit = defineEmits(["refreshData"]);

const handleRefresh = () => {
  emit("refreshData");
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Add an Artist</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="sm:max-w-[425px]">
        <form @submit="onSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormDescription> </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>

          <div class="">
            <FormField v-slot="{ componentField }" name="spotify_id">
              <FormItem>
                <FormLabel>Spotify ID</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormDescription> </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div>
            <div class="flex justify-start mt-4">
              <Button type="submit"> Submit </Button>
            </div>
          </div>
        </form>
      </div>
    </CardContent>
  </Card>
</template>
