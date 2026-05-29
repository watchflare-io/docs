import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

export const prerender = true;

const docs = await getCollection("docs");

const pages: Record<string, { title: string; description: string }> = {};

// Static pages (home uses a hand-crafted static image, not generated)
pages["fr/changelog"] = {
  title: "Changelog — Watchflare Docs",
  description: "Historique des versions et notes de mise à jour de Watchflare.",
};

// MDX content pages
// Entry IDs: "en/section/slug" or "fr/section/slug"
// EN: strip "en/" prefix → route key = "section/slug"
// FR: keep "fr/" prefix → route key = "fr/section/slug"
for (const entry of docs) {
  const routeKey = entry.id.startsWith("en/") ? entry.id.slice(3) : entry.id;
  pages[routeKey] = {
    title: entry.data.title,
    description: entry.data.description,
  };
}

// FR fallback: mirror all EN pages for FR routes not yet translated
for (const entry of docs) {
  if (!entry.id.startsWith("en/")) continue;
  const frKey = `fr/${entry.id.slice(3)}`;
  if (!pages[frKey]) {
    pages[frKey] = { title: entry.data.title, description: entry.data.description };
  }
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description,
    fonts: [
      "./src/fonts/Inter/Inter-Regular.ttf",
      "./src/fonts/Inter/Inter-Bold.ttf",
    ],
    font: {
      title: {
        size: 60,
        lineHeight: 1.2,
        families: ["Inter"],
        weight: "Bold",
        color: [0, 0, 0],
      },
      description: {
        size: 28,
        lineHeight: 1.4,
        families: ["Inter"],
        weight: "Normal",
        color: [110, 120, 108],
      },
    },
    bgImage: {
      path: (() => {
        const lang = path.startsWith("fr/") ? "fr" : "en";
        const section = path.replace(/^fr\//, "").split("/")[0];
        const map: Record<string, string> = {
          "get-started": `./src/images/og-docs-bg-get-started-${lang}.png`,
          "hub": `./src/images/og-docs-bg-hub-${lang}.png`,
          "agent": `./src/images/og-docs-bg-agent-${lang}.png`,
          "monitoring": `./src/images/og-docs-bg-monitoring-${lang}.png`,
          "reference": `./src/images/og-docs-bg-reference-${lang}.png`,
        };
        return map[section] ?? `./public/og-docs-${lang}.png`;
      })(),
      fit: "contain",
    },
    logo: {
      path: "./src/images/nothing.png",
      size: [20, page.title.length < 40 ? 110 : 80],
    },
    padding: 60,
    quality: 100,
  }),
});
