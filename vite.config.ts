import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  /** サブディレクトリ配信（GitHub Pages 等）のときは `"/リポジトリ名/"` に変更 */
  base: "/",
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
