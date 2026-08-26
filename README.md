# Watchflare Docs

Documentation site for [Watchflare](https://github.com/watchflare-io/watchflare) — a self-hosted host monitoring solution.

**Live site:** [docs.watchflare.io](https://docs.watchflare.io)

## What's in here

Guides, reference pages, and architecture concepts covering:

- Deploying the Hub with Docker Compose
- Enrolling agents on Linux and macOS
- Configuring alerts and notification channels
- Two-factor authentication, systemd services, and package inventory
- PKI, TLS 1.3, and HMAC-SHA256 security model
- Configuration reference for all environment variables

Site chrome (navigation, search, home) is available in **English** and **French**. The Get Started guides have French pages; other `/fr/...` URLs fall back to English until translated.

## Stack

| Tool | Role |
|---|---|
| [Astro 6](https://astro.build) | Static site generator |
| MDX | Markdown with component support |
| [MiniSearch](https://lucaong.github.io/minisearch/) | Client-side full-text search |
| Native CSS | No framework, design tokens only |

## Local development

Requires Node >= 22.12.0 and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm check      # astro check (types + content)
pnpm build      # Production build → ./dist/
pnpm preview    # Preview production build
```

Search (`⌘K`) works in `pnpm dev`: indexes are generated as `/search-index-en.json` and `/search-index-fr.json` routes.

## Deployment

Hosted on [Cloudflare Pages](https://pages.cloudflare.com/). `.github/workflows/deploy.yml` triggers the Cloudflare deploy hook on a `watchflare-release` dispatch from the app repo, or via manual `workflow_dispatch`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Content lives in `src/content/docs/`. Each MDX file maps directly to a URL:

```
src/content/docs/en/hub/configuration.mdx  →  /hub/configuration/
src/content/docs/fr/hub/configuration.mdx  →  /fr/hub/configuration/
```

Without a French MDX file, `/fr/...` serves the English page with a fallback notice.

## License

[MIT](LICENSE) — documentation and site source code only.
The Watchflare application itself is licensed under [AGPL-3.0](https://github.com/watchflare-io/watchflare/blob/main/LICENSE).
