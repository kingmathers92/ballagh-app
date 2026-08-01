import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Ballagh",
        short_name: "Ballagh",
        description:
          "A bilingual Islamic companion: Quran, prayer times, Qibla, hadith, and reflection.",
        theme_color: "#2A4B8D",
        background_color: "#14171F",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  build: {
    rollupOptions: {
      external: [/node_modules\/adhan\/tsconfig\.json/],
    },
  },
});