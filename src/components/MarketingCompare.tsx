import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Layers3,
  RadioTower,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { SiteLink } from "@/lib/navigation";
import { ClosingCta } from "./MarketingHome";

const platforms = [
  {
    name: "NexusObserve",
    type: "Customer-owned control plane",
    deployment: "Self-hosted",
    otel: "Native OTLP over HTTP and gRPC",
    context:
      "Native agents + specialized plugins + OpenTelemetry + incident evidence",
    consideration:
      "Operate and size your own application, Postgres, and ClickHouse.",
    href: "/docs",
    source: "NexusObserve documentation",
  },
  {
    name: "Datadog",
    type: "Managed observability platform",
    deployment: "SaaS backend",
    otel: "SDK, Collector, and Datadog distribution paths",
    context: "APM, infrastructure, and a broad managed ecosystem",
    consideration:
      "Feature compatibility varies with the OpenTelemetry ingestion path.",
    href: "https://docs.datadoghq.com/opentelemetry/compatibility/",
    source: "Datadog OTel compatibility",
  },
  {
    name: "Dynatrace",
    type: "Enterprise observability platform",
    deployment: "SaaS and ActiveGate ingestion",
    otel: "Direct OTLP uses HTTP with binary protobuf",
    context: "Application observability and enriched topology",
    consideration:
      "A Collector can convert OTLP/gRPC to HTTP; topology enrichment requires configuration.",
    href: "https://docs.dynatrace.com/docs/ingest-from/opentelemetry/otlp-api",
    source: "Dynatrace OTLP endpoints",
  },
  {
    name: "SigNoz",
    type: "OpenTelemetry-based observability",
    deployment: "Cloud and self-hosted",
    otel: "OpenTelemetry application instrumentation and collection",
    context: "Traces, logs, metrics, dashboards, and exceptions",
    consideration:
      "Evaluate its service investigation workflow and self-hosted deployment against your operational needs.",
    href: "https://signoz.io/docs/introduction/",
    source: "SigNoz documentation",
  },
  {
    name: "CubeAPM",
    type: "Self-hosted application observability",
    deployment: "Self-hosted",
    otel: "OpenTelemetry Collector integration",
    context: "APM, infrastructure, logs, and documented MCP access",
    consideration:
      "MCP availability is shared across products. Compare tool coverage and access controls.",
    href: "https://docs.cubeapm.com/mcp-server",
    source: "CubeAPM MCP documentation",
  },
];

export function MarketingCompare() {
  return (
    <div className="marketing-compare">
      <section className="product-marketing-hero section-frame">
        <Badge variant="outline">CHOOSE WHAT FITS YOUR OPERATIONS</Badge>
        <h1>
          Open standards.
          <br />
          <span className="gradient-text">Different approaches.</span>
        </h1>
        <p>
          Compare how you collect, investigate, and operate. Native agents,
          plugin coverage, open telemetry, deployment, and operational ownership
          all shape the platform you need.
        </p>
        <div className="hero-actions">
          <Button asChild size="lg" className="main-cta">
            <SiteLink href="/product">
              Explore NexusObserve
              <ArrowRight size={16} />
            </SiteLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="outline-cta">
            <SiteLink href="/docs/monitoring-sources">
              Find your collection path
              <ArrowUpRight size={15} />
            </SiteLink>
          </Button>
        </div>
      </section>
      <section className="section-frame comparison-section">
        <div className="comparison-intro">
          <div>
            <p className="eyebrow">PLATFORM PERSPECTIVES</p>
            <h2>Compare the operating model.</h2>
          </div>
          <span className="comparison-date">Reviewed September 16, 2026</span>
        </div>
        <div className="platform-comparison-table">
          <table>
            <caption className="sr-only">
              Deployment, OpenTelemetry paths, and investigation context by
              platform
            </caption>
            <thead>
              <tr>
                <th scope="col">Platform</th>
                <th scope="col">Deployment</th>
                <th scope="col">OpenTelemetry path</th>
                <th scope="col">Investigation context</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform, i) => (
                <tr
                  key={platform.name}
                  className={i === 0 ? "nexus-comparison-row" : ""}
                >
                  <th scope="row">
                    <strong>{platform.name}</strong>
                    <small>{platform.type}</small>
                  </th>
                  <td>{platform.deployment}</td>
                  <td>{platform.otel}</td>
                  <td>{platform.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="comparison-footnote">
          A view of documented approaches, rather than a feature or performance
          benchmark. Capabilities depend on edition, instrumentation, and
          configuration.
        </p>
        <div className="vendor-notes">
          {platforms.map((platform, i) => (
            <Card className="vendor-note" key={platform.name}>
              <div>
                <span className="vendor-index">0{i + 1}</span>
                <h3>{platform.name}</h3>
              </div>
              <p>{platform.consideration}</p>
              {i === 0 ? (
                <SiteLink className="text-link" href={platform.href}>
                  {platform.source}
                  <ArrowUpRight size={14} />
                </SiteLink>
              ) : (
                <a
                  className="text-link"
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {platform.source}
                  <ArrowUpRight size={14} />
                </a>
              )}
            </Card>
          ))}
        </div>
      </section>
      <section className="section-frame marketing-section">
        <div className="section-heading">
          <p className="eyebrow">WHY TEAMS CONSIDER NEXUSOBSERVE</p>
          <h2>Ownership, with operational depth.</h2>
          <p>
            For environments where the telemetry backend and the production
            estate need to work together.
          </p>
        </div>
        <div className="comparison-value-grid">
          {[
            {
              icon: ShieldCheck,
              title: "Your deployment boundary",
              body: "Own the application, storage, access policies, network routing, and retention.",
            },
            {
              icon: Layers3,
              title: "Collection without an ultimatum",
              body: "Use standard OTLP, native agents, or a hybrid path based on the signals you need.",
            },
            {
              icon: Workflow,
              title: "Operational context in the same view",
              body: "Bring gateways, probes, samplers, rule state, and incident workflows into the investigation.",
            },
            {
              icon: Database,
              title: "Evidence your team can use",
              body: "Connect telemetry, service readiness, deployments, alerts, and local AI clients through MCP.",
            },
          ].map((item) => (
            <Card className="comparison-value-card" key={item.title}>
              <item.icon size={23} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
        <Card className="collector-context">
          <RadioTower size={25} />
          <div>
            <h3>A Collector is part of the pipeline.</h3>
            <p>
              Grafana Alloy and the upstream OpenTelemetry Collector receive,
              process, and export telemetry. Your choice of observability
              backend is a separate decision. NexusObserve can ingest standard
              OTLP from an existing Collector.
            </p>
          </div>
          <a
            className="text-link"
            href="https://grafana.com/docs/alloy/latest/introduction/"
            target="_blank"
            rel="noreferrer"
          >
            About Alloy
            <ArrowUpRight size={14} />
          </a>
        </Card>
        <p className="comparison-bottom-note">
          <CheckCircle2 size={14} />
          Storage control gives you choices. Total cost still depends on ingest,
          retention, compute, and the people operating the stack.
        </p>
      </section>
      <ClosingCta />
    </div>
  );
}
