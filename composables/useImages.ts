export default async (artistName: String) => {
  console.log("finding images", artistName);
  const trimmedName = artistName.trim().replace(/'/g, "%27").replace(/ /g, "_");
  console.log("trimmedName", trimmedName);
  var mediaUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${trimmedName}`;
  console.log("mediaUrl", mediaUrl);
  const { data } = await useFetch(mediaUrl);
  console.log("wikiMedia", data);

  return data;
};
