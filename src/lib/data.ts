import type { PluginMeta, Category } from "./types";
import marketplace from "../data/marketplace.json";
import meta from "../data/plugin-meta.json";

const categoryMeta = meta.categories as Record<
  string,
  { displayName: string; description: string }
>;
const pluginMeta = meta.plugins as Record<
  string,
  { version?: string; license?: string; status: string; tags: string[]; verified: boolean }
>;

function enrichPlugin(raw: (typeof marketplace.plugins)[number]): PluginMeta {
  const extra = pluginMeta[raw.name] ?? {
    status: "active",
    tags: [],
    verified: false,
  };
  return {
    ...raw,
    version: extra.version,
    license: extra.license,
    status: extra.status as PluginMeta["status"],
    tags: extra.tags,
    verified: extra.verified,
  };
}

export function getAllPlugins(): PluginMeta[] {
  return marketplace.plugins.map(enrichPlugin);
}

export function getCategories(): Category[] {
  const seen = new Set<string>();
  const cats: Category[] = [];
  for (const p of marketplace.plugins) {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      const cm = categoryMeta[p.category];
      cats.push({
        name: p.category,
        displayName: cm?.displayName ?? p.category,
        description: cm?.description ?? "",
      });
    }
  }
  return cats;
}

export function getPluginsByCategory(category: string): PluginMeta[] {
  return getAllPlugins().filter((p) => p.category === category);
}

export function getPlugin(name: string): PluginMeta | undefined {
  return getAllPlugins().find((p) => p.name === name);
}

export function getFeaturedPlugins(count = 4): PluginMeta[] {
  return getAllPlugins()
    .filter((p) => p.verified && p.status === "active")
    .slice(0, count);
}
