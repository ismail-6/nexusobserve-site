import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clipboard,
  Cloud,
  Code2,
  Database,
  Download,
  FileCheck2,
  Globe2,
  HardDriveDownload,
  Layers3,
  LockKeyhole,
  PackageCheck,
  Puzzle,
  RadioTower,
  ReceiptText,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Header, Footer } from "./components/SiteChrome";
import { Card } from "./components/ui/card";
import { MarketingHome, MarketingProduct } from "./components/MarketingHome";
import { MarketingCompare } from "./components/MarketingCompare";
import { SiteLink, goTo } from "./lib/navigation";
import { OtelControlPlanePage } from "./OtelControlPlane";
import { GuideArticlePage, GuidesPage, getGuideMeta } from "./OtelGuides";

const AgentCollectionPage = lazy(() =>
  import("./AgentControlPlane").then((module) => ({
    default: module.AgentControlPlanePage,
  })),
);
const PluginCatalogPage = lazy(() =>
  import("./components/CollectionPages").then((module) => ({
    default: module.PluginCatalogPage,
  })),
);

type DocSlug =
  | "download-install"
  | "quickstart"
  | "production"
  | "opentelemetry"
  | "agent"
  | "plugins"
  | "mcp"
  | "monitoring-sources";

const defaultDescription =
  "Self-hosted observability and operations with native agent collection, specialized plugins, OpenTelemetry, and incident investigation in one connected platform.";

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "NexusObserve — Observe everything. Own the whole picture.",
    description: defaultDescription,
  },
  "/product": {
    title: "Product — NexusObserve",
    description:
      "One self-hosted observability and operations platform for native agent collection, specialized plugins, OpenTelemetry, and incident investigation.",
  },
  "/agents": {
    title: "Agent-based collection — NexusObserve",
    description:
      "Fetch host, process, file, database, and private endpoint signals directly with the NexusObserve agent. Native collection for your production estate.",
  },
  "/plugins": {
    title: "Native plugin catalog — NexusObserve",
    description:
      "Browse native NexusObserve plugins for infrastructure, processes, services, files, databases, and private endpoints. Search samplers and explore collection controls.",
  },
  "/industries": {
    title: "Industries — NexusObserve",
    description:
      "Where NexusObserve fits: payments and financial services, SaaS, e-commerce, regulated enterprise, platform teams, and AI operations.",
  },
  "/compare": {
    title: "Compare — NexusObserve",
    description:
      "Compare deployment, collection, investigation, and operational ownership across NexusObserve and other observability platforms.",
  },
  "/docs": {
    title: "Docs — NexusObserve",
    description:
      "NexusObserve setup docs: deployment, native agent collection, plugin configuration, OpenTelemetry, hybrid monitoring, and MCP AI investigation.",
  },
  "/downloads": {
    title: "Downloads — NexusObserve",
    description:
      "Download the self-hosted NexusObserve application and agent packages, with SHA-256 checksums for verification.",
  },
  "/opentelemetry": {
    title: "OpenTelemetry control plane — NexusObserve",
    description:
      "Configure OpenTelemetry sources, instrumentation, Collector fleets, pipelines, destinations, safe rollouts, health, and cost from one workspace.",
  },
  "/guides": {
    title: "OpenTelemetry guides — NexusObserve",
    description:
      "Practical OpenTelemetry guides for deployment models, instrumentation, Collector fleets, centralized configuration, pipelines, rollouts, and troubleshooting.",
  },
};

const industries: Array<{
  icon: LucideIcon;
  title: string;
  bestFor: string;
  outcomes: string[];
}> = [
  {
    icon: ReceiptText,
    title: "Financial services & payments",
    bestFor:
      "Keep transaction evidence close to the systems your business depends on.",
    outcomes: [
      "Follow payments across services, queues, and databases.",
      "Investigate latency alongside private infrastructure and local checks.",
      "Keep telemetry and audit evidence inside your deployment boundary.",
    ],
  },
  {
    icon: Code2,
    title: "Product engineering",
    bestFor:
      "Give developers the context to understand what changed in production.",
    outcomes: [
      "Connect traces, errors, logs, and deployment versions.",
      "Bring browser experience and backend service health into the same investigation.",
      "Build dashboards and alert rules around the behavior your users rely on.",
    ],
  },
  {
    icon: Globe2,
    title: "Commerce & critical journeys",
    bestFor:
      "See the dependencies behind every checkout, order, and customer request.",
    outcomes: [
      "Follow a failed request from the application to its downstream dependency.",
      "Monitor important endpoints with synthetic and private-location checks.",
      "Use incident timelines and ownership to coordinate the response.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Private & regulated infrastructure",
    bestFor:
      "Own where your data lives and how your operational tools reach it.",
    outcomes: [
      "Run NexusObserve, Postgres, and ClickHouse in infrastructure you control.",
      "Choose agentless OTLP or governed native agents for each environment.",
      "Export control evidence for your internal audit and vendor review.",
    ],
  },
  {
    icon: Cloud,
    title: "Platform & infrastructure teams",
    bestFor:
      "Turn a sprawling estate into services, signals, and coverage you can understand.",
    outcomes: [
      "Connect Linux hosts, containers, Kubernetes, and cloud telemetry.",
      "Find gaps in monitoring coverage and service readiness.",
      "Pair open Collector pipelines with native checks where local access matters.",
    ],
  },
  {
    icon: Bot,
    title: "AI-assisted operations",
    bestFor:
      "Give your investigation tools access to useful, connected production context.",
    outcomes: [
      "Connect local AI clients through a self-hosted, token-gated MCP server.",
      "Query metrics, search logs, inspect traces, and gather incident evidence.",
      "Keep the same service and readiness context available to people and tools.",
    ],
  },
];

const downloadArtifacts = [
  {
    icon: PackageCheck,
    title: "NexusObserve application",
    subtitle: "Server, API, and web console package",
    file: "/downloads/nexusobserve-application-linux-amd64.tar.gz",
    platform: "Linux amd64",
    size: "Application archive",
    install:
      "Run as the self-hosted control plane with Postgres and ClickHouse.",
  },
  {
    icon: HardDriveDownload,
    title: "NexusObserve agent",
    subtitle: "Direct infrastructure and operations collection",
    file: "/downloads/nexusobserve-agent-linux-amd64.tar.gz",
    platform: "Linux amd64",
    size: "Agent archive",
    install:
      "Install on hosts where private reachability, local samplers, or plugin depth matters.",
  },
];

const docArticles: Record<
  DocSlug,
  {
    title: string;
    eyebrow: string;
    icon: LucideIcon;
    summary: string;
    sections: Array<{
      heading: string;
      body: string;
      code?: string;
      checks?: string[];
    }>;
  }
> = {
  "download-install": {
    title: "Download and install",
    eyebrow: "Start here",
    icon: Download,
    summary:
      "Download the application or agent package, verify the checksum, then choose the setup path that matches your environment.",
    sections: [
      {
        heading: "Download the application package",
        body: "Use this package when you want the NexusObserve server, API, and web console binary. The full server still needs configuration plus Postgres and ClickHouse.",
        code:
          'SITE_URL="__SITE_ORIGIN__"\n' +
          'curl -LO "$SITE_URL/downloads/nexusobserve-application-linux-amd64.tar.gz"\n' +
          'curl -LO "$SITE_URL/downloads/checksums.sha256"\n' +
          "sha256sum -c checksums.sha256\n" +
          "tar -xzf nexusobserve-application-linux-amd64.tar.gz\n" +
          "chmod +x nexusobserve-linux-amd64",
        checks: [
          "Use the Docker quickstart for the fastest full local stack.",
          "Use the production setup guide when you already have Postgres and ClickHouse.",
          "Do not expose the server publicly before TLS, auth, backups, and retention are decided.",
        ],
      },
      {
        heading: "Download the agent package",
        body: "Use the agent as a primary collection runtime for host state, private checks, SQL samplers, file monitoring, and operational signals.",
        code:
          'SITE_URL="__SITE_ORIGIN__"\n' +
          'curl -LO "$SITE_URL/downloads/nexusobserve-agent-linux-amd64.tar.gz"\n' +
          'curl -LO "$SITE_URL/downloads/checksums.sha256"\n' +
          "sha256sum -c checksums.sha256\n" +
          "tar -xzf nexusobserve-agent-linux-amd64.tar.gz\n" +
          "chmod +x nexusobserve-agent-linux-amd64",
        checks: [
          "Create a short-lived enrollment token in the console.",
          "Enroll the agent against your NexusObserve server.",
          "Enable only the plugins and paths required for that host class.",
        ],
      },
      {
        heading: "Choose the next guide",
        body: "Start with Local quickstart or Production server setup. Then choose Agent-based collection setup and Native plugin setup for direct collection, or OpenTelemetry setup for SDKs and Collectors. A hybrid estate can use both.",
      },
    ],
  },
  quickstart: {
    title: "Quick start",
    eyebrow: "Your first workspace",
    icon: Terminal,
    summary:
      "Start NexusObserve, Postgres, and ClickHouse with the Docker quick start, then connect your first infrastructure or application signal.",
    sections: [
      {
        heading: "Start the stack",
        body: "On a machine with Docker installed, run the quick start. It starts the application and both backing databases with persistent volumes.",
        code: "curl -fsSL __SITE_ORIGIN__/downloads/quickstart.sh | sh",
        checks: [
          "Open http://localhost:8080 after the containers start.",
          "Create the first admin user in the web console.",
          "Keep your working directory and persistent volumes for future runs.",
        ],
      },
      {
        heading: "Connect your first signal",
        body: "For direct infrastructure collection, enroll a NexusObserve agent and enable native plugins for your host, files, databases, or private checks. For application telemetry, connect an OpenTelemetry SDK or Collector. Both paths feed the same product.",
        checks: [
          "Choose native agent collection, OpenTelemetry, or both for your environment.",
          "Confirm your host or service and its incoming signals appear in the console.",
          "Check collected samples, log records, or traces before creating alerts.",
        ],
      },
      {
        heading: "Operate your local deployment",
        body: "Inspect the stack, read application logs, and update the containers from your quick-start deployment directory.",
        code: "cd ~/nexusobserve\ndocker compose ps\ndocker compose logs -f nexusobserve\ndocker compose pull && docker compose up -d",
      },
      {
        heading: "Prepare for production",
        body: "Use the production guide to configure storage, retention, backups, TLS, and access policies for your environment. Native packages are available from the Downloads page when you prefer a Linux service deployment.",
      },
    ],
  },
  production: {
    title: "Production server setup",
    eyebrow: "Self-hosted install",
    icon: Database,
    summary:
      "Install the NexusObserve application on a Linux/systemd host with managed Postgres and ClickHouse URLs.",
    sections: [
      {
        heading: "Prepare storage",
        body: "NexusObserve uses Postgres for control-plane state and ClickHouse for high-volume telemetry. In production, point the server at managed or separately operated stores.",
        checks: [
          "Postgres URL available to the NexusObserve host.",
          "ClickHouse URL available to the NexusObserve host.",
          "TLS and network policy decided before public exposure.",
          "Backups, retention, and restore smoke tests owned by the operator.",
        ],
      },
      {
        heading: "Run the systemd installer",
        body: "Use the production installer on a Linux host with systemd and real database endpoints. It performs preflight checks before handing off to the main install script.",
        code:
          "curl -fsSL https://get.nexusobserve.io | sh -s -- \\\n" +
          "  --postgres-url 'postgres://nexusobserve:secret@postgres.example.com:5432/nexusobserve?sslmode=require' \\\n" +
          "  --clickhouse-url 'clickhouse://nexusobserve:secret@clickhouse.example.com:9000/nexusobserve?dial_timeout=10s&read_timeout=30s&compress=true'",
      },
      {
        heading: "Expected service shape",
        body: "The production path supports Linux/systemd hosts. Container and Kubernetes deployment guides cover teams running orchestrated environments.",
        checks: [
          "Console and API on the configured HTTP port.",
          "OTLP HTTP on 4318 and OTLP gRPC on 4317 when enabled.",
          "Agent transport on the configured agent port.",
          "Audit, backup, retention, and trust evidence reviewed before broad rollout.",
        ],
      },
    ],
  },
  opentelemetry: {
    title: "OpenTelemetry setup",
    eyebrow: "Agentless path",
    icon: RadioTower,
    summary:
      "Use standard OpenTelemetry SDKs or a customer-managed Collector to send traces, metrics, and logs without installing the NexusObserve agent.",
    sections: [
      {
        heading: "Set the common application environment",
        body: "Every service needs a stable service name, environment, endpoint, protocol, and resource attributes. Direct OTLP is useful for labs and first validation.",
        code:
          "export OTEL_SERVICE_NAME=checkout-api\n" +
          "export OTEL_RESOURCE_ATTRIBUTES=service.namespace=commerce,service.version=1.0.0,deployment.environment.name=development,team=payments\n" +
          "export OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318\n" +
          "export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf\n" +
          "export OTEL_TRACES_EXPORTER=otlp\n" +
          "export OTEL_METRICS_EXPORTER=otlp\n" +
          "export OTEL_LOGS_EXPORTER=otlp",
      },
      {
        heading: "Use a Collector for production",
        body: "The Collector path is the recommended production shape because it gives batching, retries, memory protection, queues, tail sampling, transforms, file logs, host metrics, and one controlled egress point.",
        checks: [
          "Collector health endpoint enabled.",
          "Batch and memory limiter processors configured.",
          "OTLP exporter points at NexusObserve with auth headers when required.",
          "Resource attributes include service, environment, team, version, and collection model.",
        ],
      },
      {
        heading: "Validate receiver status",
        body: "After sending telemetry, check NexusObserve receiver diagnostics and then verify traces, logs, metrics, services, and dashboards in the console.",
        code: "curl -sS http://127.0.0.1:8080/api/otlp/status",
      },
    ],
  },
  agent: {
    title: "Agent-based collection setup",
    eyebrow: "Operations runtime",
    icon: Server,
    summary:
      "Install the NexusObserve agent where host visibility, private reachability, SQL checks, file monitoring, low-latency dataviews, or governed local samplers matter.",
    sections: [
      {
        heading: "When to choose the agent",
        body: "Choose the agent as a primary collection runtime for infrastructure, private systems, and operational checks. Native plugins fetch signals directly and feed the same dashboards, dataviews, rules, and investigations as OpenTelemetry.",
        checks: [
          "Host CPU, disk, network, hardware, process, and systemd state.",
          "Private SQL/database checks and internal network checks.",
          "Log tailing, FKM, FTM, x-ping, x-traffic, and toolkit samplers.",
          "Gateway, probe, sampler, dataview, rule, incident, and command workflows.",
        ],
      },
      {
        heading: "Install and enroll",
        body: "The agent enrolls with a short-lived token, then receives identity and runtime configuration from the control plane.",
        code:
          "tar -xzf nexusobserve-agent-linux-amd64.tar.gz\n" +
          "chmod +x nexusobserve-agent-linux-amd64\n" +
          "sudo ./nexusobserve-agent-linux-amd64 enroll \\\n" +
          "  --server https://your-nexusobserve-host \\\n" +
          "  --token <one-time-enrollment-token>",
      },
      {
        heading: "Enterprise policy posture",
        body: "The security model treats the agent as a governed operations runtime. Regulated deployments use plugin allowlists, read-path allowlists, egress allowlists, signed config, secret providers, and audit export.",
      },
    ],
  },
  plugins: {
    title: "Native plugin setup",
    eyebrow: "Collection catalog",
    icon: Puzzle,
    summary:
      "Choose native samplers, configure their targets and collection controls, then connect operational signals to dataviews, dashboards, and alert rules.",
    sections: [
      {
        heading: "Choose the plugin for your system",
        body: "Browse the native plugin catalog for host counters, process and service state, files and logs, SQL samplers, endpoint checks, and custom operations. These plugins are separate from OpenTelemetry SDK and receiver templates.",
        checks: [
          "CPU, disk, network, hardware, containers, and Kubernetes.",
          "Process and systemd service monitoring.",
          "File keyword monitoring, file transmission monitoring, and log tailing.",
          "Read-only SQL query sampling and private network or HTTP checks.",
        ],
      },
      {
        heading: "Configure the collection target",
        body: "In your NexusObserve console, select the plugin for the probe or sampler, then configure its interval, target, and supported source settings. For SQL, use scoped read-only credentials. For file monitors, choose explicit read paths.",
        checks: [
          "Set collection intervals and bounded timeouts.",
          "Choose approved database, file, interface, or endpoint targets.",
          "Apply plugin, path, network, and executable allowlists for the host class.",
        ],
      },
      {
        heading: "Turn samples into an operating view",
        body: "Verify incoming measurements and row identities in the dataview. Build dashboards and rules around the signal, then connect alerts to services, owners, and incident investigation. Use hybrid collection when application telemetry also arrives through OpenTelemetry.",
      },
    ],
  },
  mcp: {
    title: "MCP AI investigation",
    eyebrow: "AI agent access",
    icon: Bot,
    summary:
      "Expose controlled observability tools to local AI clients through a self-hosted, token-gated stdio MCP server.",
    sections: [
      {
        heading: "Build or package the MCP server",
        body: "The MCP server uses the same storage configuration as the main API and requires explicit API tokens for initialization.",
        code:
          "make mcp-server\n" +
          "make mcp-server-release\n" +
          "export NEXUSOBSERVE_MCP_API_TOKENS='local-dev-token,breakglass-token'",
      },
      {
        heading: "Client configuration shape",
        body: "Claude Desktop, Cursor, VS Code, Codex, Gemini CLI, and other stdio clients use the same command plus environment shape.",
        code:
          "{\n" +
          '  "mcpServers": {\n' +
          '    "nexusobserve": {\n' +
          '      "command": "/opt/nexusobserve/bin/nexusobserve-mcp",\n' +
          '      "env": {\n' +
          '        "NEXUSOBSERVE_CONFIG": "/etc/nexusobserve/config.yaml",\n' +
          '        "NEXUSOBSERVE_MCP_API_TOKENS": "local-dev-token"\n' +
          "      }\n" +
          "    }\n" +
          "  }\n" +
          "}",
      },
      {
        heading: "Investigation workflow",
        body: "Start from services or active alerts, then pivot into service context, exceptions, profiles, synthetics, deployments, readiness, monitoring gaps, and OTLP status.",
        checks: [
          "query_metrics, search_logs, get_trace, list_services.",
          "list_active_alerts, get_alert_history, acknowledge_alert.",
          "get_incident_context and find_monitoring_gaps.",
          "get_service_readiness, list_deployments, and get_otlp_status.",
        ],
      },
    ],
  },
  "monitoring-sources": {
    title: "Monitoring source decisions",
    eyebrow: "Setup model",
    icon: Layers3,
    summary:
      "Start from the systems you operate, then choose native agent collection, OpenTelemetry SDKs and Collectors, or hybrid monitoring. Each path is part of the same NexusObserve product.",
    sections: [
      {
        heading: "Ask three setup questions",
        body: "Choose the collection model around the signals and access your environment needs. Native plugins and open telemetry both feed useful dashboards, dataviews, alerts, and investigations.",
        checks: [
          "What do you want to monitor?",
          "What access do you have?",
          "Do you already have telemetry, a collector, or an incumbent agent?",
        ],
      },
      {
        heading: "Recommended paths",
        body: "Native agents collect directly from hosts, containers, services, files, databases, and private endpoints. OpenTelemetry SDKs and Collectors connect application traces, logs, and metrics. A hybrid estate combines both.",
        checks: [
          "Application: OpenTelemetry SDK or Collector.",
          "Linux host or VM: NexusObserve agent for guided local depth, or OTel hostmetrics for read-only.",
          "Kubernetes: OTel Collector Helm chart, with agent optional for private checks.",
          "Datadog/DDOT migration: dual-ship through OTel Collector, then move alerts last.",
        ],
      },
      {
        heading: "Default promise",
        body: "For guided monitoring, install agent, apply templates, then get dashboards and alerts. For OpenTelemetry, create one endpoint and token, accept data, then make services and dashboards visible.",
      },
    ],
  },
};

function normalizePath(pathname: string) {
  if (pathname === "/index.html") return "/";
  if (pathname.length > 1 && pathname.endsWith("/"))
    return pathname.slice(0, -1);
  return pathname;
}

function usePathname() {
  const [path, setPath] = useState(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const update = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", update);
    window.addEventListener("site:navigate", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("site:navigate", update);
    };
  }, []);

  return path;
}

function useRouteMeta(path: string) {
  useEffect(() => {
    const docMatch = path.match(/^\/docs\/([^/]+)$/);
    const guideMatch = path.match(/^\/guides\/([^/]+)$/);
    let title: string;
    let description: string;

    if (guideMatch && getGuideMeta(guideMatch[1])) {
      const guide = getGuideMeta(guideMatch[1]);
      title = `${guide.title} — NexusObserve Guides`;
      description = guide.summary;
    } else if (docMatch && docMatch[1] in docArticles) {
      const article = docArticles[docMatch[1] as DocSlug];
      title = `${article.title} — NexusObserve Docs`;
      description = article.summary;
    } else if (
      path in routeMeta ||
      path.startsWith("/opentelemetry/") ||
      path.startsWith("/agents/")
    ) {
      const meta =
        path in routeMeta
          ? routeMeta[path]
          : routeMeta[
              path.startsWith("/agents/") ? "/agents" : "/opentelemetry"
            ];
      title = meta.title;
      description = meta.description;
    } else {
      title = "Page not found — NexusObserve";
      description = defaultDescription;
    }

    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    for (const property of ["og:title", "twitter:title"]) {
      document
        .querySelector(`meta[property="${property}"], meta[name="${property}"]`)
        ?.setAttribute("content", title);
    }
    for (const property of ["og:description", "twitter:description"]) {
      document
        .querySelector(`meta[property="${property}"], meta[name="${property}"]`)
        ?.setAttribute("content", description);
    }
    const canonicalUrl = new URL(path, "https://nexusobserve.io").href;
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonicalUrl);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", canonicalUrl);
  }, [path]);
}

function App() {
  const path = usePathname();
  const isWorkspace = ["/opentelemetry", "/agents"].some(
    (prefix) => path === prefix || path.startsWith(prefix + "/"),
  );
  useRouteMeta(path);
  const [copied, setCopied] = useState<string | null>(null);

  async function copyToClipboard(value: string, label: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1500);
    }
  }

  const page = useMemo(() => {
    const docMatch = path.match(/^\/docs\/([^/]+)$/);
    const guideMatch = path.match(/^\/guides\/([^/]+)$/);
    if (guideMatch && getGuideMeta(guideMatch[1])) {
      return (
        <GuideArticlePage
          slug={guideMatch[1]}
          copied={copied}
          onCopy={copyToClipboard}
          onNavigate={goTo}
        />
      );
    }
    if (docMatch && docMatch[1] in docArticles) {
      return (
        <DocArticlePage
          slug={docMatch[1] as DocSlug}
          copied={copied}
          onCopy={copyToClipboard}
        />
      );
    }

    switch (path) {
      case "/":
        return <MarketingHome />;
      case "/product":
        return <MarketingProduct />;
      case "/agents":
        return (
          <AgentCollectionPage
            path={path}
            copied={copied}
            onCopy={copyToClipboard}
          />
        );
      case "/plugins":
        return <PluginCatalogPage />;
      case "/industries":
        return <IndustriesPage />;
      case "/compare":
        return <MarketingCompare />;
      case "/docs":
        return <DocsPage />;
      case "/guides":
        return <GuidesPage onNavigate={goTo} />;
      case "/downloads":
        return <DownloadsPage copied={copied} onCopy={copyToClipboard} />;
      default:
        if (path.startsWith("/agents/")) {
          return (
            <AgentCollectionPage
              path={path}
              copied={copied}
              onCopy={copyToClipboard}
            />
          );
        }
        if (path === "/opentelemetry" || path.startsWith("/opentelemetry/")) {
          return (
            <OtelControlPlanePage
              path={path}
              copied={copied}
              onCopy={copyToClipboard}
              onNavigate={goTo}
            />
          );
        }
        return <NotFoundPage />;
    }
  }, [path, copied]);

  return (
    <div className={isWorkspace ? "site-shell workspace-shell" : "site-shell"}>
      <Header path={path} />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="collection-loading section-frame" role="status">
              Loading…
            </div>
          }
        >
          {page}
        </Suspense>
      </main>
      {!isWorkspace && <Footer />}
    </div>
  );
}

function PageHero({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="page-hero section-frame">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="hero-lede">{body}</p>
      {actions ? <div className="hero-actions">{actions}</div> : null}
    </section>
  );
}

function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built for the systems you can’t afford to lose sight of."
        body="From payment rails to private platforms, connect telemetry to the infrastructure, people, and workflows that keep your business running."
      />
      <section className="section-frame page-section">
        <div className="industry-grid">
          {industries.map((item) => (
            <IndustryCard key={item.title} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}

function DocsPage() {
  const docList = Object.entries(docArticles) as Array<
    [DocSlug, (typeof docArticles)[DocSlug]]
  >;
  return (
    <>
      <PageHero
        eyebrow="Docs"
        title="From your first signal to your production estate."
        body="Deploy your workspace, connect your applications, and build a collection path that fits your environment. Practical guides for each step."
      />
      <section className="section-frame page-section">
        <div className="docs-card-grid">
          {docList.map(([slug, article]) => {
            const Icon = article.icon;
            return (
              <Card asChild key={slug}>
                <SiteLink href={`/docs/${slug}`} className="doc-card">
                  <Icon size={24} />
                  <p className="eyebrow">{article.eyebrow}</p>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <span>
                    Open guide <ArrowRight size={16} />
                  </span>
                </SiteLink>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}

function DocArticlePage({
  slug,
  copied,
  onCopy,
}: {
  slug: DocSlug;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
}) {
  const article = docArticles[slug];
  const Icon = article.icon;
  const siteOrigin =
    typeof window === "undefined"
      ? "http://localhost:5174"
      : window.location.origin;
  const renderCode = (code: string) =>
    code.split("__SITE_ORIGIN__").join(siteOrigin);
  return (
    <>
      <section className="article-layout section-frame">
        <aside className="article-sidebar">
          <SiteLink href="/docs" className="back-link">
            <ArrowRight size={16} />
            All docs
          </SiteLink>
          {(
            Object.entries(docArticles) as Array<
              [DocSlug, (typeof docArticles)[DocSlug]]
            >
          ).map(([key, item]) => (
            <SiteLink
              key={key}
              href={`/docs/${key}`}
              className={key === slug ? "article-nav active" : "article-nav"}
            >
              {item.title}
            </SiteLink>
          ))}
        </aside>
        <article className="article-body">
          <div className="article-title">
            <span className="doc-icon">
              <Icon size={24} />
            </span>
            <div>
              <p className="eyebrow">{article.eyebrow}</p>
              <h1>{article.title}</h1>
              <p>{article.summary}</p>
            </div>
          </div>
          {article.sections.map((section, index) => (
            <section className="article-section" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.checks ? (
                <ul className="check-list">
                  {section.checks.map((check) => (
                    <li key={check}>
                      <CheckCircle2 size={16} />
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.code ? (
                <CodeBlock
                  code={renderCode(section.code)}
                  label={`${slug}-${index}`}
                  copied={copied}
                  onCopy={onCopy}
                />
              ) : null}
            </section>
          ))}
        </article>
      </section>
    </>
  );
}

function DownloadsPage({
  copied,
  onCopy,
}: {
  copied: string | null;
  onCopy: (value: string, label: string) => void;
}) {
  const siteOrigin =
    typeof window === "undefined"
      ? "http://localhost:5174"
      : window.location.origin;
  const verifyCommand =
    `SITE_URL="${siteOrigin}"\n` +
    'curl -O "$SITE_URL/downloads/checksums.sha256"\n' +
    "sha256sum -c checksums.sha256";

  return (
    <>
      <PageHero
        eyebrow="Downloads"
        title="Your workspace starts here."
        body="Download the NexusObserve application for your self-hosted control plane. Add the native agent for local infrastructure and private network visibility."
      />

      <section className="section-frame page-section">
        <div className="download-grid">
          {downloadArtifacts.map((item) => {
            const Icon = item.icon;
            return (
              <Card asChild key={item.title}>
                <article className="download-card">
                  <div className="download-head">
                    <span className="download-icon">
                      <Icon size={25} />
                    </span>
                    <span>{item.platform}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                  <div className="package-meta">
                    <span>{item.size}</span>
                    <span>SHA-256 listed in checksums file</span>
                  </div>
                  <p>{item.install}</p>
                  <a className="button primary full" href={item.file} download>
                    <Download size={18} />
                    Download package
                  </a>
                </article>
              </Card>
            );
          })}
        </div>
        <div className="download-footer">
          <a href="/downloads/checksums.sha256" download>
            <ShieldCheck size={17} />
            Download checksums
          </a>
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Release workflow</p>
          <h2>Make it ready for your environment.</h2>
        </div>
        <div className="enterprise-grid">
          <article>
            <FileCheck2 size={22} />
            <h3>1. Review artifact and checksum</h3>
            <p>
              Download packages, verify SHA-256, and store the approved artifact
              in your internal registry or golden image workflow.
            </p>
          </article>
          <article>
            <Database size={22} />
            <h3>2. Prepare backing services</h3>
            <p>
              Provision Postgres and ClickHouse, then decide retention, backups,
              restore tests, network exposure, and TLS policy.
            </p>
          </article>
          <article>
            <LockKeyhole size={22} />
            <h3>3. Apply control policy</h3>
            <p>
              For agent rollouts, decide enrollment tokens, plugin allowlists,
              egress rules, read-path rules, secret providers, and audit export.
            </p>
          </article>
          <article>
            <Activity size={22} />
            <h3>4. Validate signal readiness</h3>
            <p>
              Confirm OTLP status, collector health, service identity,
              dashboards, alerts, and incident workflows before production
              cutover.
            </p>
          </article>
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Verification</p>
          <h2>Always verify before install.</h2>
        </div>
        <CodeBlock
          code={verifyCommand}
          label="verify-downloads"
          copied={copied}
          onCopy={onCopy}
        />
      </section>
    </>
  );
}

function IndustryCard({
  item,
  compact = false,
}: {
  item: (typeof industries)[number];
  compact?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Card asChild>
      <article className="industry-card">
        <Icon size={24} />
        <h3>{item.title}</h3>
        <p>{item.bestFor}</p>
        {!compact ? (
          <ul>
            {item.outcomes.map((outcome) => (
              <li key={outcome}>
                <CheckCircle2 size={15} />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </Card>
  );
}

function CodeBlock({
  code,
  label,
  copied,
  onCopy,
}: {
  code: string;
  label: string;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
}) {
  return (
    <div className="code-block">
      <button
        className="copy-button"
        type="button"
        onClick={() => onCopy(code, label)}
      >
        <Clipboard size={15} />
        {copied === label ? "Copied" : "Copy"}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function NotFoundPage() {
  return (
    <PageHero
      eyebrow="Not found"
      title="That page is not part of the site yet."
      body="Use the main navigation to open the product overview, docs, comparison, industry pages, or downloads."
      actions={
        <SiteLink className="button primary" href="/">
          Go home
        </SiteLink>
      }
    />
  );
}

export default App;
