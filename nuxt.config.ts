export default defineNuxtConfig({
  compatibilityDate: "latest",
  css: ["~/assets/styles/app.scss"],
  future: {
    compatibilityVersion: 5,
  },
  devtools: { enabled: true },
  experimental: {
    typescriptPlugin: true,
  },
  modules: ["@nuxt/fonts", "@vite-pwa/nuxt"],

  app: {
    head: {
      title: "750wpm - Speed Reading with RSVP",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Train your brain to read faster with RSVP (Rapid Serial Visual Presentation). Import articles, track progress, and improve your reading speed.",
        },
        { name: "theme-color", content: "#C23B3B" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "750wpm - Speed Reading with RSVP" },
        {
          property: "og:description",
          content:
            "Train your brain to read faster with RSVP. Import articles, track progress, and improve your reading speed.",
        },
        { property: "og:site_name", content: "750wpm" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: "750wpm - Speed Reading with RSVP" },
        {
          name: "twitter:description",
          content:
            "Train your brain to read faster with RSVP. Import articles, track progress, and improve your reading speed.",
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      ],
    },
  },

  nitro: {
    preset: "cloudflare-module",
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "750wpm",
      short_name: "750wpm",
      description: "Train your brain to read faster with RSVP",
      theme_color: "#C23B3B",
      background_color: "#0a0a0a",
      display: "standalone",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },
});
