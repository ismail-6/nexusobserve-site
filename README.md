# NexusObserve Public Site

Public demo and documentation website for NexusObserve.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The site is static and can be deployed to Vercel, Netlify, or Cloudflare Pages. It uses client-side routing with absolute asset paths (`base: "/"`), so the host must serve the site from the domain root and rewrite all unknown paths to `/index.html` — `netlify.toml`, `vercel.json`, and `public/_redirects` already configure this.

## Downloads

The download buttons serve files from `public/downloads`:

- `nexusobserve-application-linux-amd64.tar.gz`
- `nexusobserve-agent-linux-amd64.tar.gz`
- `checksums.sha256`

Replace those files with release builds before publishing.

## Pages

- `/` - homepage and product explanation.
- `/product` - platform architecture and product surface.
- `/industries` - use cases across industries.
- `/compare` - comparison against common observability and collector tools.
- `/docs` - setup guide index.
- `/docs/download-install`, `/docs/quickstart`, `/docs/production`, `/docs/opentelemetry`, `/docs/agent`, `/docs/mcp`, `/docs/monitoring-sources` - detailed docs pages.
- `/downloads` - enterprise-style artifact page.
