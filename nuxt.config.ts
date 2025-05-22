import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "Short.",
      meta: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "author", content: "Kenneth Ng" },
        { property: "og:title", content: "Short." },
        { property: "og:site_name", content: "Kenneth Ng" },
        { property: "og:type", content: "website" },
        { name: "description", content: "no tracking or anything. not a scam, or a sham, or spam. just a URL shortener." },
        { property: "og:description", content: "no tracking or anything. not a scam, or a sham, or spam. just a URL shortener." },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/ruler.png" }],
      htmlAttrs: {
        lang: "en",
      },
    },
  },
});
