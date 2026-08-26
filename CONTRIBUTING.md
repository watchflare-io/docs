# Contributing

Docs live in `src/content/docs/`. Each MDX file maps to a URL:

```
src/content/docs/en/hub/configuration.mdx  →  /hub/configuration/
src/content/docs/fr/hub/configuration.mdx  →  /fr/hub/configuration/
```

Required frontmatter: `title` and `description`. New pages must also be added to `src/utils/nav.ts`. French MDX is optional; without it, `/fr/...` falls back to English.

```bash
pnpm install && pnpm check && pnpm build
```
