export async function useInfo() {
  const client = useSupabaseClient();

  const { data: moves } = await useAsyncData("getMoves", async () => {
    const { data } = await client.from("moves").select("*");

    return data;
  });

  return moves;
}
