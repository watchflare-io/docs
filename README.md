# Watchflare Docs

Documentation site for [Watchflare](https://github.com/watchflare-io/watchflare) — a self-hosted host monitoring solution.

**Live site:** [docs.watchflare.io](https://docs.watchflare.io)

## What's in here

Guides, reference pages, and architecture concepts covering:

- Deploying the Hub with Docker Compose
- Enrolling agents on Linux and macOS
- Configuring alerts and notification channels
- Package inventory and vulnerability tracking
- PKI, TLS 1.3, and HMAC-SHA256 security model
- Configuration reference for all environment variables

Content is available in **English** and **French**.

## Stack

| Tool | Role |
|---|---|
| [Astro 6](https://astro.build) | Static site generator |
| MDX | Markdown with component support |
| [Pagefind](https://pagefind.app) | Full-text search |
| Native CSS | No framework, design tokens only |

## Local development

Requires Node >= 22.12.0 and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # Production build → ./dist/
pnpm preview    # Preview production build
```

> Search (`⌘K`) only works after a build. Run `pnpm dev:search` to develop with search enabled.

## Deployment

Deployed automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

## Contributing

Content lives in `src/content/docs/`. Each MDX file maps directly to a URL:

```
src/content/docs/en/hub/configuration.mdx  →  /hub/configuration/
src/content/docs/fr/hub/configuration.mdx  →  /fr/hub/configuration/
```

Frontmatter schema:

```yaml
---
title: "Page Title"
description: "One-line description for SEO and search."
---
```

See [`CLAUDE.md`](.claude/CLAUDE.md) for full architecture notes.

## License

[MIT](LICENSE) — documentation and site source code only.
The Watchflare application itself is licensed under [AGPL-3.0](https://github.com/watchflare-io/watchflare/blob/main/LICENSE).
