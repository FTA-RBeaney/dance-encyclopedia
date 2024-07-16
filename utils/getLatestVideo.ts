export const getLatestVideo = async () => {
  const runtimeConfig = useRuntimeConfig();
  const API_KEY = runtimeConfig.public.YOUTUBE_API_KEY;
  const PLAYLIST_ID = runtimeConfig.public.YOUTUBE_PLAYLIST_ID;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.items.length > 0) {
      const latestVideo = data.items[data.items.length - 1];
      const videoId = latestVideo.snippet.resourceId.videoId;

      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    console.error("Error fetching the latest video: ", error);
  }

  return "https://www.youtube.com/embed/tHYDP9DuPwk?si=bikNxKfor0irJSet";
};
