export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const clientID = runtimeConfig.public.spotifyClientID;
  const clientSecret = runtimeConfig.public.spotifyClientSecret;
  const refreshToken = runtimeConfig.public.spotifyRefreshToken;

  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

  // This gets the access token from Spotify to connect to the API using provided refresh token.
  const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(clientID + ":" + clientSecret)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token:
          "AQDobmiY0b0KNGKYq9e9Yc5cgeiywvgRlLdnZL62tkEUb41urb99glRIdq_Yiru0RDFZcdmwi9na34Zh1QsN03x-G56GkUgWP64W5S6kD8rlyayCknurbcvnzlCLNsiDI58",
      }).toString(),
    });
    return response.json();
  };

  nuxtApp.getNowPlaying = async (playlistId) => {
    const { access_token: accessToken } = await getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json());
  };
});
