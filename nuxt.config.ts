// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/cloudinary-video-player@1.5.9/dist/cld-video-player.min.css",
        },
      ],
      script: [
        { src: "//www.instagram.com/embed.js" },
        {
          src: "https://unpkg.com/cloudinary-core@latest/cloudinary-core-shrinkwrap.min.js",
        },
        {
          src: "https://unpkg.com/cloudinary-video-player@1.5.9/dist/cld-video-player.min.js",
        },
      ],
    },
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/supabase",
    "shadcn-nuxt",
    "@nuxtjs/algolia",
    "@pinia/nuxt",
    "@nuxtjs/cloudinary",
    "@nuxt/icon",
  ],
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  algolia: {
    apiKey: process.env.ALGOLIA_API_KEY,
    applicationId: process.env.ALGOLIA_APPLICATION_ID,
    instantSearch: {
      // theme: "algolia",
    },
  },

  router: {
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        return { behavior: "smooth" };
      }
      return { x: 0, y: 0 }; // only for route changes
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
    url: process.env.PUBLIC_SUPABASE_URL,
    key: process.env.PUBLIC_SUPABASE_KEY,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/search", "/classes", "/*"],
    },
  },
});
