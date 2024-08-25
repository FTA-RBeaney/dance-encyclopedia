// https://nuxt.com/docs/api/configuration/nuxt-config
import { vite as vidstack } from "vidstack/plugins";

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/cloudinary-video-player@1.5.9/dist/cld-video-player.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/vue-plyr/dist/vue-plyr.css",
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
        {
          src: "https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Fshow%2F5eXZwvvxt3K2dxha3BSaAe",
        },
      ],
    },
    pageTransition: { name: "fade", mode: "out-in" },
    layoutTransition: { name: "fade", mode: "out-in" },
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
    "@nuxtjs/color-mode",
    "@nuxt/scripts",
    "@vueuse/motion/nuxt",
  ],
  colorMode: {
    classSuffix: "",
  },
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  algolia: {
    apiKey: "b17aa4af840f1188bd26139185711c9f",
    applicationId: "3GXH3T2OIX",
  },

  runtimeConfig: {
    public: {
      spotifyClientID: "13bb1428eae64e859182a5744c991e93",
      spotifyRefreshToken:
        "AQCzaemXxqH_N9FTdPPwNrcCdvMVcrPAVscKaeuSc6HLMwmmDlu_NpJ_Z8VPeIZKZXZVntHpK5Ridj59M4ItFxpQBpn-gQTQm4J390yLDMqSKAT8XHIXNG7K0MoPwfYhko8",
      GOOGLE_API_KEY: "AIzaSyC9kNzY_EqckULIwSmij1ztvzWjKyvcHso",
      spotifyClientSecret: "d0df83bb2a3749f8ba4832815d8ef74c",
      SPREAD_SHEET_ID: "1CVkFzZB8Eg6Ig8GvvvWgSC_uHjzRYp31DRnKV-sfxzQ",
      YOUTUBE_API_KEY: "AIzaSyDPwdCSsl2eQdCa-gt7zlkvIaytjiT7Uwk",
      YOUTUBE_PLAYLIST_ID: process.env.NUXT_YOUTUBE_PLAYLIST_ID,

      motion: {
        directives: {
          "pop-bottom": {
            initial: {
              scale: 0,
              opacity: 0,
              y: 100,
            },
            visible: {
              scale: 1,
              opacity: 1,
              y: 0,
            },
          },
        },
      },
    },
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  supabase: {
    url: "https://misyrpoxvyxwrnhnmeww.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3lycG94dnl4d3JuaG5tZXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0ODkxMjEsImV4cCI6MjAzNTA2NTEyMX0.IIVld8FNxJrqPbIfBzXxYMOz2RCEBWwvfeHNHaenZ-Q",
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/*"],
    },
  },

  nitro: {
    prerender: {
      ignore: ["/"],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("media-"),
    },
  },
  vite: {
    plugins: [vidstack()],
  },
});
