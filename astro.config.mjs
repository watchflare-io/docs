// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const SITE = 'https://docs.watchflare.io';
const BUILD_DATE = new Date().toISOString().split('T')[0];

function urlToSrcPath(url) {
  const path = url.replace(SITE + '/', '').replace(/\/$/, '');
  if (path === '' || path === SITE) return 'src/pages/index.astro';
  if (path === 'changelog') return 'src/content/docs/en/changelog.mdx';
  if (path === 'fr') return 'src/pages/fr/index.astro';
  if (path === 'fr/changelog') return 'src/content/docs/en/changelog.mdx';
  if (path.startsWith('fr/')) {
    const slug = path.slice(3);
    const frPath = `src/content/docs/fr/${slug}.mdx`;
    return existsSync(frPath) ? frPath : `src/content/docs/en/${slug}.mdx`;
  }
  return `src/content/docs/en/${path}.mdx`;
}

function gitDate(filePath) {
  try {
    const ts = execSync(`git log -1 --format=%ct -- "${filePath}"`, { encoding: 'utf8' }).trim();
    if (ts) return new Date(Number(ts) * 1000).toISOString().split('T')[0];
  } catch {}
  return BUILD_DATE;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.watchflare.io',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [mdx(), sitemap({
    serialize(item) {
      return { ...item, lastmod: gitDate(urlToSrcPath(item.url)) };
    },
  })],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
    },
  },
});
