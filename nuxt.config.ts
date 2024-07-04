// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/supabase",
    "shadcn-nuxt",
    "@nuxtjs/algolia",
  ],
  algolia: {
    apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
    applicationId: process.env.ALGOLIA_APPLICATION_ID,
    instantSearch: {
      // theme: "algolia",
    },
  },
  routeRules: {
    "/": { prerender: true },
  },

  runtimeConfig: {
    public: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      SPREAD_SHEET_ID: process.env.SPREAD_SHEET_ID,
    },
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  content: {
    experimental: {
      search: {
        indexed: true,
        options: {
          fields: ["title", "titles"],
          storeFields: ["title", "titles"],
          addAll: true,
          searchOptions: {
            prefix: true,
            fuzzy: 0.2,
            boost: {
              title: 2,
              titles: 0,
            },
          },
        },
      },
    },
  },

  env: {
    spotifyClientID: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spotifyRefreshToken: process.env.SPOTIFY_RT,
  },

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/search", "/classes", "/*"],
    },
  },
});
