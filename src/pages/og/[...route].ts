import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

export const prerender = true;

const docs = await getCollection("docs");

const pages: Record<string, { title: string; description: string }> = {};

// Static pages
pages["home"] = {
  title: "Watchflare Docs",
  description:
    "Guides, reference and concepts to deploy Watchflare, enroll agents and read your metrics.",
};
pages["fr/home"] = {
  title: "Documentation Watchflare",
  description:
    "Guides, références et concepts pour déployer Watchflare, enregistrer des agents et lire vos métriques.",
};
pages["changelog"] = {
  title: "Changelog — Watchflare Docs",
  description: "Release history and version notes for Watchflare.",
};
pages["fr/changelog"] = {
  title: "Changelog — Watchflare Docs",
  description: "Historique des versions et notes de mise à jour de Watchflare.",
};

// MDX content pages
// Entry IDs: "en/section/slug" or "fr/section/slug"
// URL path for EN: "/section/slug/" (strip "en/" prefix)
// URL path for FR: "/fr/section/slug/" (keep "fr/" prefix)
for (const entry of docs) {
  const routeKey = entry.id.startsWith("en/")
    ? entry.id.slice(3)
    : entry.id;
  pages[routeKey] = {
    title: entry.data.title,
    description: entry.data.description,
  };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
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
        color: [45, 90, 36],
      },
      description: {
        size: 28,
        lineHeight: 1.4,
        families: ["Inter"],
        weight: "Normal",
        color: [94, 106, 121],
      },
    },
    bgGradient: [[255, 255, 255]],
    logo: {
      path: "./src/images/logo-og.png",
      size: [80, 80],
    },
    padding: 60,
    quality: 100,
  }),
});
