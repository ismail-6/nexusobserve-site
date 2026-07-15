import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BellRing,
  Bot,
  CheckCircle2,
  Clipboard,
  Cloud,
  Code2,
  Database,
  DatabaseZap,
  Download,
  FileCheck2,
  FileText,
  Gauge,
  Globe2,
  HardDriveDownload,
  Layers3,
  LineChart,
  LockKeyhole,
  Network,
  PackageCheck,
  RadioTower,
  ReceiptText,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type DocSlug =
  | "download-install"
  | "quickstart"
  | "production"
  | "opentelemetry"
  | "agent"
  | "mcp"
  | "monitoring-sources";

const routes = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/industries", label: "Industries" },
  { href: "/compare", label: "Compare" },
  { href: "/docs", label: "Docs" },
  { href: "/downloads", label: "Downloads" },
];

const productPillars: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
  proof: string;
}> = [
  {
    icon: DatabaseZap,
    title: "Observability backend",
    body:
      "Ingest metrics, logs, traces, Prometheus scrape, browser RUM, synthetic checks, profiles, and cloud inventory into one self-hosted control plane.",
    proof: "Built surfaces include metrics, logs, traces, services, dashboards, RUM, profiles, cloud inventory, and website monitors.",
  },
  {
    icon: Workflow,
    title: "Operations control plane",
    body:
      "Model production estates with gateways, probes, samplers, dataviews, rules, active times, commands, incidents, and coverage intelligence.",
    proof: "The console has routes for gateways, rules, live alerts, alert history, incidents, platform health, and monitoring coverage.",
  },
  {
    icon: Server,
    title: "Local-depth agent",
    body:
      "Use a first-party agent and plugins for host, process, disk, network, systemd, SQL, file monitoring, private checks, and low-latency local state.",
    proof: "The repo ships native plugin binaries for CPU, disk, network, process, hardware, SQL, systemd, log tailing, FKM, FTM, x-ping, and x-traffic.",
  },
  {
    icon: Bot,
    title: "AI investigation interface",
    body:
      "Expose incident context to local AI clients through an MCP stdio server that can query metrics, search logs, fetch traces, inspect alerts, and find monitoring gaps.",
    proof: "MCP tools cover services, alerts, dashboards, hosts, exceptions, synthetics, profiles, readiness, deployments, OTLP status, and incident context.",
  },
];

const homeMonitoringAreas: Array<{
  icon: LucideIcon;
  title: string;
  watch: string[];
  how: string;
  result: string;
}> = [
  {
    icon: Server,
    title: "Infrastructure monitoring",
    watch: [
      "CPU, memory, disk, network, and host health.",
      "Processes, systemd services, containers, and Kubernetes nodes.",
      "Platform health, missing coverage, and infrastructure alerts.",
    ],
    how:
      "Start with OpenTelemetry host/container receivers. Add the NexusObserve agent when you need local process, filesystem, systemd, or private host checks.",
    result:
      "You can tell which machine, process, disk, node, or service is involved before jumping across tools.",
  },
  {
    icon: Activity,
    title: "Application monitoring",
    watch: [
      "Traces, latency, errors, throughput, services, and dependencies.",
      "Deployments, versions, ownership, readiness, and SLO evidence.",
      "RUM, synthetics, profiles, and exception groups where available.",
    ],
    how:
      "Send OTLP from OpenTelemetry SDKs or a Collector. Keep service names and resource attributes clean so teams, versions, environments, and dependencies stay searchable.",
    result:
      "A slow or failing service can be traced back to spans, logs, dependencies, deploy context, and incident evidence.",
  },
  {
    icon: Network,
    title: "Network monitoring",
    watch: [
      "Private endpoint reachability and route health.",
      "Ping-style checks, traffic checks, HTTP checks, websites, and TLS status.",
      "Internal dependency reachability from the places that actually matter.",
    ],
    how:
      "Run checks from controlled gateways or agent locations close to the systems being monitored. Use x-ping, x-traffic, website monitors, HTTP checks, and network plugins when local reachability matters.",
    result:
      "You can separate app failures from network, route, endpoint, DNS, TLS, or dependency reachability problems.",
  },
  {
    icon: FileText,
    title: "Log monitoring",
    watch: [
      "Application logs, file logs, container logs, and syslog-style sources.",
      "Severity, fields, trace IDs, span IDs, and error patterns.",
      "Sensitive fields that need redaction or dropping before storage.",
    ],
    how:
      "Send structured logs through OTLP, collect files with OpenTelemetry filelog receivers, or use native log tailing when local templates and file access are needed.",
    result:
      "Logs become searchable incident evidence connected to traces, alerts, services, and the timeline of what happened.",
  },
];

const homeOutcomePoints = [
  "Receives traces, metrics, and logs through OpenTelemetry and existing collectors.",
  "Adds a local agent only where host, process, disk, SQL, file, systemd, or private network depth is needed.",
  "Connects signals to alerts, incidents, topology, dashboards, service readiness, and audit context.",
  "Gives approved AI tools a controlled MCP path to investigate the same evidence your team sees.",
];

const industries: Array<{
  icon: LucideIcon;
  title: string;
  bestFor: string;
  outcomes: string[];
}> = [
  {
    icon: ReceiptText,
    title: "Payments and financial services",
    bestFor:
      "Trading, payments, settlement, fintech platforms, internal banking systems, and regulated transactional workloads.",
    outcomes: [
      "Self-host telemetry when PII, PCI, MNPI, or transaction data cannot leave the operator boundary.",
      "Trace a business transaction across services, queues, databases, and downstream systems.",
      "Use p95, p99, p99.9, and p99.99 latency evidence for execution and settlement workflows.",
      "Keep audit evidence for alert actions, incident state, commands, and trust posture.",
    ],
  },
  {
    icon: Code2,
    title: "SaaS and product engineering",
    bestFor:
      "Teams running custom APIs, frontend products, background workers, internal platforms, and customer-facing services.",
    outcomes: [
      "Use OTLP-native instrumentation across Node.js, Python, Java, Go, PHP, .NET, Ruby, and browser clients.",
      "Join traces, logs, runtime metrics, frontend sessions, RUM errors, and deployment context.",
      "Give developers AI-readable service context without asking them to scrape dashboards manually.",
      "Create saved views, dashboards, SLOs, and alerts around real product behavior.",
    ],
  },
  {
    icon: Globe2,
    title: "E-commerce and transactional apps",
    bestFor:
      "Checkout, orders, inventory, claims, bookings, fulfillment, billing, and other request-driven systems.",
    outcomes: [
      "Reconstruct transaction failures with trace IDs, logs, exception groups, and service dependencies.",
      "Alert on volume drops, error spikes, dependency failures, and outcome changes.",
      "Connect frontend RUM sessions to backend traces for customer-impact debugging.",
      "Use synthetics to watch critical flows from public or private locations.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Regulated enterprise and on-prem",
    bestFor:
      "Organizations that need data residency, customer-controlled PKI, agent policy, audit export, and private infrastructure reachability.",
    outcomes: [
      "Run the full platform inside your infrastructure with Postgres and ClickHouse.",
      "Use agentless OTLP where security review is strict, then add the agent only where local depth is needed.",
      "Prepare for BYO PKI, signed config, plugin allowlists, secrets providers, and SIEM export.",
      "Export trust evidence for internal audit and vendor review workflows.",
    ],
  },
  {
    icon: Cloud,
    title: "Platform, Kubernetes, and cloud teams",
    bestFor:
      "Infrastructure teams operating Linux hosts, Docker, Kubernetes, cloud inventory, collectors, and shared observability services.",
    outcomes: [
      "Onboard host, Docker, Kubernetes, cloud, database, and service receivers with source-first setup paths.",
      "Track collector health, service readiness, platform health, and monitoring coverage.",
      "Use OpenTelemetry Collector where it is the right pipeline, and NexusObserve agent where private local checks matter.",
      "Correlate cloud inventory and deployment metadata with telemetry.",
    ],
  },
  {
    icon: Bot,
    title: "AI operations and developer tools",
    bestFor:
      "Teams that want coding agents and ops assistants to investigate live systems through controlled local interfaces.",
    outcomes: [
      "Use a self-hosted, token-gated MCP server instead of handing a hosted vendor broad production access.",
      "Let agents query metrics, search logs, inspect traces, list alerts, and assemble incident context.",
      "Review monitoring gaps and service readiness from the same evidence model used by humans.",
      "Keep AI investigation close to your self-hosted control plane.",
    ],
  },
];

const comparisonSummary = [
  {
    title: "Customer-controlled deployment",
    body:
      "Run the control plane inside your own infrastructure with Postgres and ClickHouse, then decide retention, backups, network access, and cost boundaries yourself.",
  },
  {
    title: "Flexible collection model",
    body:
      "Start with OTLP and existing collectors when no agent is needed. Add the local agent only for host, process, filesystem, SQL, private network, and sampler depth.",
  },
  {
    title: "Operations model, not only charts",
    body:
      "Use gateways, probes, samplers, dataviews, rules, active times, commands, alerts, incidents, and coverage to model how production is actually operated.",
  },
  {
    title: "Evidence for investigation",
    body:
      "Bring traces, logs, metrics, topology, host state, service readiness, alert history, deployments, and audit posture into one investigation path.",
  },
];

const comparisonColumns = [
  "NexusObserve",
  "Datadog / New Relic / Dynatrace",
  "SigNoz / CubeAPM",
  "Grafana Alloy / OTel Collector",
  "Observe",
  "ITRS Geneos",
];

const comparisonMatrix: Array<{
  capability: string;
  values: Array<"yes" | "partial" | "no">;
  note: string;
}> = [
  {
    capability: "Self-hosted control plane",
    values: ["yes", "partial", "yes", "no", "partial", "yes"],
    note:
      "NexusObserve is built around customer-controlled deployment. OTel Collector is a collector, not a full observability control plane.",
  },
  {
    capability: "OpenTelemetry app telemetry",
    values: ["yes", "yes", "yes", "yes", "yes", "partial"],
    note:
      "NexusObserve accepts OTLP metrics, logs, and traces. Direct SDK and Collector paths are both documented.",
  },
  {
    capability: "Local operations runtime",
    values: ["yes", "partial", "partial", "no", "partial", "yes"],
    note:
      "This is the NexusObserve agent path: host/process state, private checks, SQL, FKM/FTM, x-ping, x-traffic, samplers, dataviews, and commands.",
  },
  {
    capability: "Gateways, probes, samplers, dataviews",
    values: ["yes", "partial", "no", "no", "no", "yes"],
    note:
      "These are NexusObserve product concepts from the operations model. Generic collectors do not model this workflow.",
  },
  {
    capability: "Agentless first adoption",
    values: ["yes", "partial", "yes", "yes", "yes", "partial"],
    note:
      "NexusObserve can start with OTLP, existing Collectors, cloud/export paths, browser telemetry, or other existing pipelines.",
  },
  {
    capability: "Self-hosted MCP investigation",
    values: ["yes", "partial", "partial", "no", "partial", "no"],
    note:
      "The repo includes a local stdio MCP server with tools for metrics, logs, traces, alerts, services, dashboards, incidents, readiness, and gaps.",
  },
  {
    capability: "Monitoring coverage and readiness",
    values: ["yes", "partial", "partial", "no", "partial", "partial"],
    note:
      "NexusObserve includes monitoring coverage, service readiness, platform health, OTLP status, and MCP tools for finding monitoring gaps.",
  },
  {
    capability: "Trust evidence and audit posture",
    values: ["yes", "partial", "partial", "no", "partial", "partial"],
    note:
      "The repo includes trust center/evidence export docs, audit posture, RBAC/SSO surfaces, governance pages, and regulated agent-security guidance.",
  },
  {
    capability: "Large managed SaaS integration ecosystem",
    values: ["no", "yes", "partial", "no", "partial", "no"],
    note:
      "NexusObserve is not positioned around managed SaaS integration breadth; it is positioned around self-hosting, operations depth, and controlled telemetry.",
  },
  {
    capability: "Customer-controlled storage cost",
    values: ["yes", "partial", "yes", "partial", "partial", "partial"],
    note:
      "NexusObserve uses operator-owned Postgres and ClickHouse. The repo also includes a TCO calculator API/page.",
  },
];

const operationsDepth = [
  {
    point: "Stateful operations model",
    body:
      "Gateways, probes, samplers, dataviews, rules, active times, commands, incidents, and coverage give operators a stateful view of production instead of disconnected charts.",
  },
  {
    point: "Low-latency local checks",
    body:
      "The agent path is for fresh local state: host/process health, private endpoint checks, SQL checks, file freshness, log keywords, network reachability, and governed command actions.",
  },
  {
    point: "Specialized ops plugin packs",
    body:
      "The documented pack structure is concrete: sampler templates, default severity rules, dashboard panels, alert rules, safe runbook command allowlists, fixtures, MCP paths, and benchmark evidence.",
  },
  {
    point: "Application telemetry connected to operations",
    body:
      "OTLP metrics, logs, traces, services, topology, RUM, synthetics, and collector paths sit next to local operational checks instead of living in a separate toolchain.",
  },
  {
    point: "AI-readable production context",
    body:
      "The local MCP server exposes explicit tools for metrics, logs, traces, services, alerts, dashboards, hosts, incidents, readiness, and monitoring gaps.",
  },
];

const downloadArtifacts = [
  {
    icon: PackageCheck,
    title: "NexusObserve application",
    subtitle: "Server, API, and web console package",
    file: "downloads/nexusobserve-application-linux-amd64.tar.gz",
    platform: "Linux amd64",
    size: "Application archive",
    install: "Run as the self-hosted control plane with Postgres and ClickHouse.",
  },
  {
    icon: HardDriveDownload,
    title: "NexusObserve agent",
    subtitle: "Local-depth host and operations runtime",
    file: "downloads/nexusobserve-agent-linux-amd64.tar.gz",
    platform: "Linux amd64",
    size: "Agent archive",
    install: "Install on hosts where private reachability, local samplers, or plugin depth matters.",
  },
];

const quickStartInstallSnippet = (siteOrigin: string) =>
  `SITE_URL="${siteOrigin}"
curl -LO "$SITE_URL/downloads/nexusobserve-application-linux-amd64.tar.gz"
curl -LO "$SITE_URL/downloads/checksums.sha256"
sha256sum -c checksums.sha256
tar -xzf nexusobserve-application-linux-amd64.tar.gz
chmod +x nexusobserve-linux-amd64
./nexusobserve-linux-amd64 --help`;

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
        body:
          "Use this package when you want the NexusObserve server, API, and web console binary. The full server still needs configuration plus Postgres and ClickHouse.",
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
        body:
          "Use the agent only where local host state, private checks, SQL samplers, file monitoring, or other local-depth operations are needed.",
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
        body:
          "For a quick demo, use Local quickstart. For a Linux service install, use Production server setup. For standard app telemetry, use OpenTelemetry setup. For local host or private checks, use Agent local-depth setup.",
      },
    ],
  },
  quickstart: {
    title: "Quick start",
    eyebrow: "Copy and paste",
    icon: Terminal,
    summary:
      "Download the NexusObserve application package from this site, verify the checksum, extract it, and confirm the binary works.",
    sections: [
      {
        heading: "Download and verify",
        body:
          "This is the fastest website-based path. It does not send the user to GitHub first.",
        code: quickStartInstallSnippet("__SITE_ORIGIN__"),
        checks: [
          "The package is downloaded from the same website.",
          "The checksum file is verified before extraction.",
          "The binary is made executable.",
          "The final command confirms the binary responds.",
        ],
      },
      {
        heading: "Choose the real setup path",
        body:
          "After verifying the package, use Production server setup for a Linux service install, OpenTelemetry setup for application telemetry, or Agent local-depth setup for host/private checks.",
        checks: [
          "Production server setup explains Postgres and ClickHouse requirements.",
          "OpenTelemetry setup explains OTLP ports, SDK variables, and Collector usage.",
          "Agent local-depth setup explains when the agent is actually needed.",
        ],
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
        body:
          "NexusObserve uses Postgres for control-plane state and ClickHouse for high-volume telemetry. In production, point the server at managed or separately operated stores.",
        checks: [
          "Postgres URL available to the NexusObserve host.",
          "ClickHouse URL available to the NexusObserve host.",
          "TLS and network policy decided before public exposure.",
          "Backups, retention, and restore smoke tests owned by the operator.",
        ],
      },
      {
        heading: "Run the systemd installer",
        body:
          "Use the production installer on a Linux host with systemd and real database endpoints. It performs preflight checks before handing off to the main install script.",
        code:
          "curl -fsSL https://get.nexusobserve.io | sh -s -- \\\n" +
          "  --postgres-url 'postgres://nexusobserve:secret@postgres.example.com:5432/nexusobserve?sslmode=require' \\\n" +
          "  --clickhouse-url 'clickhouse://nexusobserve:secret@clickhouse.example.com:9000/nexusobserve?dial_timeout=10s&read_timeout=30s&compress=true'",
      },
      {
        heading: "Expected service shape",
        body:
          "The production path supports Linux/systemd hosts. Container and Kubernetes deployment material also exists in the repo for teams that prefer those platforms.",
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
        body:
          "Every service needs a stable service name, environment, endpoint, protocol, and resource attributes. Direct OTLP is useful for labs and first validation.",
        code:
          "export OTEL_SERVICE_NAME=checkout-api\n" +
          "export OTEL_RESOURCE_ATTRIBUTES=service.namespace=commerce,service.version=1.0.0,deployment.environment=dev,team=payments\n" +
          "export OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318\n" +
          "export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf\n" +
          "export OTEL_TRACES_EXPORTER=otlp\n" +
          "export OTEL_METRICS_EXPORTER=otlp\n" +
          "export OTEL_LOGS_EXPORTER=otlp",
      },
      {
        heading: "Use a Collector for production",
        body:
          "The Collector path is the recommended production shape because it gives batching, retries, memory protection, queues, tail sampling, transforms, file logs, host metrics, and one controlled egress point.",
        checks: [
          "Collector health endpoint enabled.",
          "Batch and memory limiter processors configured.",
          "OTLP exporter points at NexusObserve with auth headers when required.",
          "Resource attributes include service, environment, team, version, and collection model.",
        ],
      },
      {
        heading: "Validate receiver status",
        body:
          "After sending telemetry, check NexusObserve receiver diagnostics and then verify traces, logs, metrics, services, and dashboards in the console.",
        code: "curl -sS http://127.0.0.1:8080/api/otlp/status",
      },
    ],
  },
  agent: {
    title: "Agent local-depth setup",
    eyebrow: "Operations runtime",
    icon: Server,
    summary:
      "Install the NexusObserve agent where host visibility, private reachability, SQL checks, file monitoring, low-latency dataviews, or governed local samplers matter.",
    sections: [
      {
        heading: "When to choose the agent",
        body:
          "Do not install the agent just to send standard application traces. Use it when proximity to the host or private network gives better signal than generic telemetry forwarding.",
        checks: [
          "Host CPU, disk, network, hardware, process, and systemd state.",
          "Private SQL/database checks and internal network checks.",
          "Log tailing, FKM, FTM, x-ping, x-traffic, and toolkit samplers.",
          "Gateway, probe, sampler, dataview, rule, incident, and command workflows.",
        ],
      },
      {
        heading: "Install and enroll",
        body:
          "The agent enrolls with a short-lived token, then receives identity and runtime configuration from the control plane.",
        code:
          "tar -xzf nexusobserve-agent-linux-amd64.tar.gz\n" +
          "chmod +x nexusobserve-agent-linux-amd64\n" +
          "sudo ./nexusobserve-agent-linux-amd64 enroll \\\n" +
          "  --server https://your-nexusobserve-host \\\n" +
          "  --token <one-time-enrollment-token>",
      },
      {
        heading: "Enterprise policy posture",
        body:
          "The security model treats the agent as a governed operations runtime. Regulated deployments use plugin allowlists, read-path allowlists, egress allowlists, signed config, secret providers, and audit export.",
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
        body:
          "The MCP server uses the same storage configuration as the main API and requires explicit API tokens for initialization.",
        code:
          "make mcp-server\n" +
          "make mcp-server-release\n" +
          "export NEXUSOBSERVE_MCP_API_TOKENS='local-dev-token,breakglass-token'",
      },
      {
        heading: "Client configuration shape",
        body:
          "Claude Desktop, Cursor, VS Code, Codex, Gemini CLI, and other stdio clients use the same command plus environment shape.",
        code:
          '{\n' +
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
        body:
          "Start from services or active alerts, then pivot into service context, exceptions, profiles, synthetics, deployments, readiness, monitoring gaps, and OTLP status.",
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
      "Start from what you want to monitor, then choose the safest collection path: agentless OTLP, customer-managed Collector, NexusObserve agent, or hybrid.",
    sections: [
      {
        heading: "Ask three setup questions",
        body:
          "The setup model is source-first, not agent-first. The goal is useful dashboards, alerts, readiness, traces, logs, and metrics.",
        checks: [
          "What do you want to monitor?",
          "What access do you have?",
          "Do you already have telemetry, a collector, or an incumbent agent?",
        ],
      },
      {
        heading: "Recommended paths",
        body:
          "Application APM usually starts with OTel SDKs or a Collector. Hosts, Docker, Kubernetes, databases, logs, websites, and migrations each have separate recommended paths.",
        checks: [
          "Application: OpenTelemetry SDK or Collector.",
          "Linux host or VM: NexusObserve agent for guided local depth, or OTel hostmetrics for read-only.",
          "Kubernetes: OTel Collector Helm chart, with agent optional for private checks.",
          "Datadog/DDOT migration: dual-ship through OTel Collector, then move alerts last.",
        ],
      },
      {
        heading: "Default promise",
        body:
          "For guided monitoring, install agent, apply templates, then get dashboards and alerts. For OpenTelemetry, create one endpoint and token, accept data, then make services and dashboards visible.",
      },
    ],
  },
};

function normalizePath(pathname: string) {
  if (pathname === "/index.html") return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function usePathname() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

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

function goTo(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new Event("site:navigate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function SiteLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (href.startsWith("/")) {
          event.preventDefault();
          goTo(href);
        }
      }}
    >
      {children}
    </a>
  );
}

function App() {
  const path = usePathname();
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
        return <HomePage />;
      case "/product":
        return <ProductPage />;
      case "/industries":
        return <IndustriesPage />;
      case "/compare":
        return <ComparePage />;
      case "/docs":
        return <DocsPage />;
      case "/downloads":
        return <DownloadsPage copied={copied} onCopy={copyToClipboard} />;
      default:
        return <NotFoundPage />;
    }
  }, [path, copied]);

  return (
    <div className="site-shell">
      <Header path={path} />
      <main>{page}</main>
      <Footer />
    </div>
  );
}

function Header({ path }: { path: string }) {
  return (
    <header className="topbar">
      <SiteLink href="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span>NexusObserve</span>
      </SiteLink>
      <nav className="nav-links" aria-label="Primary navigation">
        {routes.map((route) => {
          const active =
            route.href === "/" ? path === "/" : path.startsWith(route.href);
          return (
            <SiteLink
              key={route.href}
              href={route.href}
              className={active ? "active" : ""}
            >
              {route.label}
            </SiteLink>
          );
        })}
      </nav>
    </header>
  );
}

function HeroConsole() {
  return (
    <div className="console-visual" aria-label="NexusObserve console preview">
      <div className="console-toolbar">
        <span className="window-dot dot-green" />
        <span className="window-dot dot-yellow" />
        <span className="window-dot dot-red" />
        <span className="console-title">Operations workspace</span>
      </div>
      <div className="console-grid">
        <div className="console-pane wide">
          <div className="pane-heading">
            <span>Service latency</span>
            <strong>p99 184ms</strong>
          </div>
          <div className="chart-bars" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} style={{ height: `${30 + ((index * 19) % 62)}%` }} />
            ))}
          </div>
        </div>
        <div className="console-pane">
          <div className="pane-heading">
            <span>Alert state</span>
            <strong className="status-hot">3 active</strong>
          </div>
          <div className="alert-list">
            <span>checkout-api latency</span>
            <span>payments error rate</span>
            <span>worker queue depth</span>
          </div>
        </div>
        <div className="console-pane topology">
          <div className="pane-heading">
            <span>Topology</span>
            <strong>12 services</strong>
          </div>
          <svg className="topology-map" viewBox="0 0 260 120" aria-hidden="true">
            <line className="topology-edge" x1="45" y1="35" x2="130" y2="68" />
            <line className="topology-edge" x1="130" y1="68" x2="215" y2="35" />
            <line className="topology-edge" x1="130" y1="68" x2="165" y2="105" />
            <circle className="topology-node node-a" cx="45" cy="35" r="14" />
            <circle className="topology-node node-b" cx="130" cy="68" r="14" />
            <circle className="topology-node node-c" cx="215" cy="35" r="14" />
            <circle className="topology-node node-d" cx="165" cy="105" r="14" />
          </svg>
        </div>
        <div className="console-pane ai-pane">
          <div className="pane-heading">
            <span>AI context</span>
            <strong>ready</strong>
          </div>
          <p>
            MCP tools can query metrics, search logs, retrieve traces, list alerts,
            and assemble incident context.
          </p>
        </div>
      </div>
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

function HomePage() {
  return (
    <>
      <section className="home-hero section-frame">
        <div className="hero-copy">
          <p className="eyebrow">Self-hosted production monitoring</p>
          <h1>Monitor apps, infrastructure, networks, and logs from one self-hosted control plane.</h1>
          <p className="hero-lede">
            NexusObserve brings your main production signals into one place.
            Start with OpenTelemetry. Add the agent only where host-local checks
            or private network visibility matter. From there, alerts, incidents,
            topology, readiness, and MCP context help the team investigate from
            the same evidence.
          </p>
          <div className="hero-actions">
            <SiteLink className="button primary" href="/downloads">
              <Download size={18} />
              Download packages
            </SiteLink>
            <SiteLink className="button secondary" href="/docs">
              <FileText size={18} />
              Setup docs
            </SiteLink>
          </div>
          <div className="signal-row" aria-label="Platform signals">
            <span>
              <CheckCircle2 size={16} />
              Application traces
            </span>
            <span>
              <CheckCircle2 size={16} />
              Infrastructure state
            </span>
            <span>
              <CheckCircle2 size={16} />
              Network and log evidence
            </span>
          </div>
        </div>
        <HeroConsole />
      </section>

      <section className="section-frame split-band">
        <div>
          <p className="eyebrow">What it does</p>
          <h2>Turns scattered monitoring data into evidence your team can act on.</h2>
        </div>
        <ul className="home-point-list">
          {homeOutcomePoints.map((point) => (
            <li key={point}>
              <CheckCircle2 size={16} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Monitoring areas</p>
          <h2>What each area covers.</h2>
          <p>
            During an incident, the useful questions are simple: what changed,
            where did it happen, and what can we rule out? These four areas keep
            that answer close.
          </p>
        </div>
        <div className="monitoring-detail-grid">
          {homeMonitoringAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article className="monitoring-detail-card" key={area.title}>
                <Icon size={24} />
                <h3>{area.title}</h3>
                <p className="mini-label">What you monitor</p>
                <ul>
                  {area.watch.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mini-label">How the data gets in</p>
                <p className="monitoring-how">{area.how}</p>
                <p className="mini-label">What becomes clear</p>
                <div className="result-box">{area.result}</div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function ProductPage() {
  const surfaces = [
    "Metrics, logs, traces, dashboards, query builder, services, topology",
    "APM, browser RUM, RUM sessions, frontend errors, synthetics, website monitors",
    "Alerts, alert history, snoozing, incidents, notifications, SLOs",
    "Infrastructure, hosts, Kubernetes, databases, cloud inventory, platform health",
    "Gateways, probes, samplers, dataviews, rules, active times, commands",
    "RBAC, SSO, tenants, audit log, governance, trust center, TCO calculator",
  ];

  return (
    <>
      <PageHero
        eyebrow="Product"
        title="A single control plane for telemetry, local operations, and incident evidence."
        body="NexusObserve combines OpenTelemetry-native observability with an operations model for infrastructure estates and a programmatic AI investigation layer."
        actions={
          <>
            <SiteLink className="button primary" href="/docs">
              <Terminal size={18} />
              Start setup
            </SiteLink>
            <SiteLink className="button secondary" href="/compare">
              <LineChart size={18} />
              Compare tools
            </SiteLink>
          </>
        }
      />

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Core capabilities</p>
          <h2>What NexusObserve is capable of.</h2>
          <p>
            These are the main product pieces visible in the repo: server, console,
            agent, plugin suite, MCP server, deployment assets, and docs.
          </p>
        </div>
        <div className="pillar-grid">
          {productPillars.map((item) => (
            <InfoCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Console surface</p>
          <h2>What users can work with in the application.</h2>
          <p>
            This list is based on the web app routes and repository docs. It avoids
            promising features that are not represented in the codebase.
          </p>
        </div>
        <div className="surface-grid">
          {surfaces.map((surface) => (
            <div className="surface-row" key={surface}>
              <CheckCircle2 size={17} />
              <span>{surface}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Architecture</p>
          <h2>Three layers with flexible collection paths.</h2>
        </div>
        <div className="architecture-grid">
          <article>
            <RadioTower size={24} />
            <h3>Collection layer</h3>
            <p>
              Direct OTLP, OpenTelemetry Collector, existing telemetry pipelines,
              browser intake, cloud export, and NexusObserve agent/plugins.
            </p>
          </article>
          <article>
            <Server size={24} />
            <h3>Server layer</h3>
            <p>
              Normalizes telemetry, evaluates rules, manages incidents, exposes
              APIs, serves the web console, and provides AI-accessible context.
            </p>
          </article>
          <article>
            <Database size={24} />
            <h3>Storage layer</h3>
            <p>
              Postgres stores control-plane state. ClickHouse stores high-volume
              metrics, logs, traces, RUM events, and telemetry records.
            </p>
          </article>
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Collection models</p>
          <h2>Agentless, agent-based, and hybrid are all first-class.</h2>
        </div>
        <div className="model-grid">
          <ModelCard
            title="Agentless read-only"
            body="Use OTLP, OpenTelemetry Collector, existing pipelines, cloud export, browser telemetry, or provider read APIs when teams need value before installing a NexusObserve runtime."
            bestFor="Fast security approval, existing OTel estates, and cloud/export-heavy environments."
          />
          <ModelCard
            title="Agent local depth"
            body="Use the NexusObserve agent and native plugins for host, process, private network, SQL, filesystem, systemd, low-latency checks, and governed operations."
            bestFor="Controlled hosts, private networks, edge sites, and regulated operations."
          />
          <ModelCard
            title="Hybrid best path"
            body="Use OTLP for application signals and the agent for signals where proximity, private reachability, or operational control materially improves the outcome."
            bestFor="Complex estates where one collection shape is never the best answer for every signal."
          />
        </div>
      </section>
    </>
  );
}

function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Where this product fits."
        body="NexusObserve is useful when a team needs self-hosted telemetry, local infrastructure context, incident evidence, and clear operational ownership."
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

function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="A straight comparison, without pretending every tool does the same job."
        body="Use this page to see where NexusObserve is strong, where other tools are stronger, and where a feature is only partially covered."
      />

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Matrix</p>
          <h2>Feature fit by tool category.</h2>
          <p>
            Check means the category is a clear fit. Partial means it depends on
            deployment, edition, or adjacent tooling. Cross means it is not the
            main purpose of that category.
          </p>
        </div>
        <div className="comparison-matrix" role="table" aria-label="Tool comparison matrix">
          <div className="matrix-row matrix-head" role="row">
            <div role="columnheader">Capability</div>
            {comparisonColumns.map((column) => (
              <div role="columnheader" key={column}>
                {column}
              </div>
            ))}
          </div>
          {comparisonMatrix.map((row) => (
            <div className="matrix-row" role="row" key={row.capability}>
              <div className="matrix-capability" role="cell">
                <strong>{row.capability}</strong>
                <span>{row.note}</span>
              </div>
              {row.values.map((value, index) => (
                <div role="cell" key={`${row.capability}-${comparisonColumns[index]}`}>
                  <StatusBadge value={value} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Summary</p>
          <h2>What the product is built to do.</h2>
          <p>
            The matrix above shows category fit. This is the practical version:
            the product is strongest when production evidence, local control, and
            operations depth matter.
          </p>
        </div>
        <div className="focus-grid">
          {comparisonSummary.map((item) => (
            <article className="focus-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Operations depth</p>
          <h2>The important part is stateful local operations.</h2>
          <p>
            The product is not only an APM dashboard. Its strongest use is local
            operational state connected to telemetry, incident evidence, trust
            posture, and AI investigation.
          </p>
        </div>
        <div className="operations-grid">
          {operationsDepth.map((item) => (
            <article className="operations-card" key={item.point}>
              <h3>{item.point}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function DocsPage() {
  const docList = Object.entries(docArticles) as Array<[DocSlug, (typeof docArticles)[DocSlug]]>;
  return (
    <>
      <PageHero
        eyebrow="Docs"
        title="Setup docs split by real operator tasks."
        body="Start the app, send telemetry, install the agent where it adds local depth, wire AI investigation, and choose the right monitoring source path."
      />
      <section className="section-frame page-section">
        <div className="docs-card-grid">
          {docList.map(([slug, article]) => {
            const Icon = article.icon;
            return (
              <SiteLink href={`/docs/${slug}`} className="doc-card" key={slug}>
                <Icon size={24} />
                <p className="eyebrow">{article.eyebrow}</p>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span>
                  Open guide <ArrowRight size={16} />
                </span>
              </SiteLink>
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
  const siteOrigin = typeof window === "undefined" ? "http://localhost:5174" : window.location.origin;
  const renderCode = (code: string) => code.split("__SITE_ORIGIN__").join(siteOrigin);
  return (
    <>
      <section className="article-layout section-frame">
        <aside className="article-sidebar">
          <SiteLink href="/docs" className="back-link">
            <ArrowRight size={16} />
            All docs
          </SiteLink>
          {(Object.entries(docArticles) as Array<[DocSlug, (typeof docArticles)[DocSlug]]>).map(
            ([key, item]) => (
              <SiteLink
                key={key}
                href={`/docs/${key}`}
                className={key === slug ? "article-nav active" : "article-nav"}
              >
                {item.title}
              </SiteLink>
            ),
          )}
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
  const siteOrigin = typeof window === "undefined" ? "http://localhost:5174" : window.location.origin;
  const verifyCommand =
    `SITE_URL="${siteOrigin}"\n` +
    'curl -O "$SITE_URL/downloads/checksums.sha256"\n' +
    "sha256sum -c checksums.sha256";

  return (
    <>
      <PageHero
        eyebrow="Downloads"
        title="Enterprise-style packages for the application and agent."
        body="Download the self-hosted application and the local-depth agent separately. Keep checksums next to release artifacts and promote packages through your own approval process."
      />

      <section className="section-frame page-section">
        <div className="download-grid">
          {downloadArtifacts.map((item) => {
            const Icon = item.icon;
            return (
              <article className="download-card" key={item.title}>
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
            );
          })}
        </div>
        <div className="download-footer">
          <a href="downloads/checksums.sha256" download>
            <ShieldCheck size={17} />
            Download checksums
          </a>
        </div>
      </section>

      <section className="section-frame page-section">
        <div className="section-heading">
          <p className="eyebrow">Release workflow</p>
          <h2>How enterprise teams usually consume this.</h2>
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
              Confirm OTLP status, collector health, service identity, dashboards,
              alerts, and incident workflows before production cutover.
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

function InfoCard({
  item,
}: {
  item: { icon: LucideIcon; title: string; body: string; proof: string };
}) {
  const Icon = item.icon;
  return (
    <article className="info-card">
      <Icon size={23} />
      <h3>{item.title}</h3>
      <p>{item.body}</p>
      <div className="proof-box">{item.proof}</div>
    </article>
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
  );
}

function ModelCard({
  title,
  body,
  bestFor,
}: {
  title: string;
  body: string;
  bestFor: string;
}) {
  return (
    <article className="model-card">
      <h3>{title}</h3>
      <p>{body}</p>
      <div>
        <strong>Best for</strong>
        <span>{bestFor}</span>
      </div>
    </article>
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
      <button className="copy-button" type="button" onClick={() => onCopy(code, label)}>
        <Clipboard size={15} />
        {copied === label ? "Copied" : "Copy"}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StatusBadge({ value }: { value: "yes" | "partial" | "no" }) {
  const content = {
    yes: { mark: "✓", label: "Yes" },
    partial: { mark: "◐", label: "Partial" },
    no: { mark: "×", label: "No" },
  }[value];

  return (
    <span className={`status-badge ${value}`}>
      <span>{content.mark}</span>
      {content.label}
    </span>
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

function Footer() {
  return (
    <footer className="footer">
      <span>NexusObserve</span>
      <span>Self-hosted telemetry, operations, and AI investigation.</span>
    </footer>
  );
}

export default App;
