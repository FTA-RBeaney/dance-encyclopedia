export default async (limit = 30, offset = 400) => {
  const { data } = await useFetch(
    `https://musicbrainz.org/ws/2/artist?query=tag:swing&limit=${limit}&offset=${offset}&fmt=json`
  );
  console.log(
    `https://musicbrainz.org/ws/2/artist?query=tag:swing&limit=${limit}&fmt=json`
  );
  return data;
};
