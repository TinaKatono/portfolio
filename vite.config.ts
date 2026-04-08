import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
    },
  },
  preview: {
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
    },
  },
});
