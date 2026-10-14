import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"), // Points to your frontend src folder
      "@server": path.resolve(import.meta.dirname, "../server/src"),
    },
  },
  plugins: [react(), tailwindcss()],
});
