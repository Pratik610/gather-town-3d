import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import dotenv from "dotenv";


dotenv.config();
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://gather-town-3d.onrender.com",
        changeOrigin: true, // Change origin for the request
        secure: false, // Allow HTTP (not HTTPS)
      },
    },
  },
});
