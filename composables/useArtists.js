export default async () => {
  const { data } = await useFetch(
    "https://musicbrainz.org/ws/2/artist?query=tag:swing&limit=10&fmt=json"
  );

  return data;
};
