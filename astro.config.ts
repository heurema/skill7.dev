import { defineConfig } from "astro/config";
import UnoCSS from "@unocss/astro";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://skill7.dev",
  output: "static",
  integrations: [UnoCSS(), sitemap()],
});
