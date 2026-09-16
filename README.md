# NexusObserve Public Site

Public demo and documentation website for NexusObserve.

The interface uses shadcn/ui with Radix primitives, Tailwind CSS, and a customized
Shadcn Space numbered FAQ. The light design with a saved dark-mode option, product previews, and marketing
copy are adapted for NexusObserve rather than copied from the backend markdown.
Workspace previews use illustrative data; the static site does not connect to a
running NexusObserve backend.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Browser checks

```sh
npx playwright install chromium
npm run test:e2e
```

To use an existing Chrome installation, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome`.
The checks cover interactive previews, collection tabs, clipboard actions,
source configuration, navigation, downloads, responsive layouts, and automated
accessibility checks.

The site is static and can be deployed to Vercel, Netlify, or Cloudflare Pages. It uses client-side routing with absolute asset paths (`base: "/"`), so the host must serve the site from the domain root and rewrite all unknown paths to `/index.html` — `netlify.toml`, `vercel.json`, and `public/_redirects` already configure this.

## Downloads

The download buttons serve files from `public/downloads`:

- `nexusobserve-application-linux-amd64.tar.gz`
- `nexusobserve-agent-linux-amd64.tar.gz`
- `checksums.sha256`
- `quickstart.sh` - Docker installer adapted from the CE project and served directly by this site.

Replace those files with release builds before publishing.

## Pages

- `/` - homepage and product explanation.
- `/product` - platform architecture and product surface.
- `/industries` - use cases across industries.
- `/compare` - sourced comparison of platform operating models and OpenTelemetry paths.
- `/docs` - setup guide index.
- `/docs/download-install`, `/docs/quickstart`, `/docs/production`, `/docs/opentelemetry`, `/docs/agent`, `/docs/mcp`, `/docs/monitoring-sources` - detailed docs pages.
- `/downloads` - native application and agent packages with checksums.
- `/opentelemetry` - interactive OpenTelemetry workspace preview.
- `/opentelemetry/sources` - searchable source catalog and starter configuration generation.
- `/guides` - OpenTelemetry instrumentation, collection, configuration, and troubleshooting guides.

The platform overview presents native agent collection, the native plugin catalog,
and OpenTelemetry as equal product capabilities. `/agents` opens a native collection workspace with setup, plugins, samplers,
fleet, dataviews, configuration, security, rollouts, and health. `/plugins` remains
available as a standalone catalog. Both catalogs share CE registry definitions.
Agent inventory and preview values are illustrative; settings are local examples
and the static site does not enroll agents or deploy configuration.
