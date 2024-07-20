export default async (artistName: String) => {
  const trimmedName = artistName.trim().replace(/'/g, "%27").replace(/ /g, "_");
  var mediaUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${trimmedName}`;
  const { data } = await useFetch(mediaUrl);

  return data;
};
