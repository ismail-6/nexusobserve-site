import {
  ArrowRight,
  Braces,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  Network,
  Puzzle,
  RadioTower,
  Server,
  Terminal,
} from "lucide-react";
import { Card } from "./ui/card";
import { SiteLink } from "@/lib/navigation";
import { nativePlugins } from "@/nativePluginCatalog";
import { otelSourceCatalog } from "@/otelSourceCatalog";

export function CollectionCapabilitiesSection() {
  const capabilities = [
    {
      icon: Cpu,
      title: "Agent-based collection",
      eyebrow: "FETCH DIRECTLY",
      body: "Collect host, process, filesystem, database, and private network signals with a runtime you manage. A complete collection path for your infrastructure.",
      detail: "Local collection · Private reachability · Shared dataviews",
      href: "/agents",
      link: "Explore agent collection",
    },
    {
      icon: Puzzle,
      title: "Plugin catalog",
      eyebrow: "EXTEND YOUR COVERAGE",
      body: "Choose native samplers for the systems you operate. From CPU and SQL to file arrivals and endpoint checks, bring specialized operational signals into the same view.",
      detail:
        nativePlugins.length +
        " native plugins · Scheduled samplers · Custom operations",
      href: "/plugins",
      link: "Browse native plugins",
    },
    {
      icon: RadioTower,
      title: "OpenTelemetry",
      eyebrow: "CONNECT OPEN PIPELINES",
      body: "Bring existing SDKs and Collectors into NexusObserve. Configure application traces, metrics, logs, and telemetry pipelines alongside your agent-collected signals.",
      detail: "HTTP & gRPC · SDKs & Collectors · Pipeline management",
      href: "/opentelemetry",
      link: "Explore OpenTelemetry",
    },
  ];
  return (
    <section
      className="collection-capabilities section-frame marketing-section"
      aria-label="Platform collection capabilities"
    >
      <div className="section-heading centered">
        <p className="eyebrow">ONE PLATFORM. MORE WAYS TO SEE.</p>
        <h2>
          Your infrastructure. Your applications.
          <br />
          <span className="muted-heading">The whole operating picture.</span>
        </h2>
        <p>
          Collect directly, extend with native plugins, and connect open
          telemetry.
          <br className="desktop-break" /> Every path feeds the same dashboards,
          alerts, and investigations.
        </p>
      </div>
      <div className="collection-capability-grid">
        {capabilities.map(({ icon: Icon, ...item }) => (
          <Card asChild key={item.href}>
            <article className="collection-capability-card">
              <span className="feature-icon">
                <Icon size={23} />
              </span>
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="capability-detail">{item.detail}</span>
              <SiteLink href={item.href} className="text-link">
                {item.link}
                <ArrowRight size={16} />
              </SiteLink>
            </article>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function SourceCoverageSection() {
  const groups = [
    {
      title: "Native plugin catalog",
      icon: Puzzle,
      body:
        nativePlugins.length +
        " plugins for direct collection from hosts, services, files, databases, and private endpoints.",
      href: "/plugins",
      link: "Explore native plugins",
      items: [
        { name: "CPU", icon: Cpu, href: "/plugins?plugin=cpu" },
        { name: "SQL", icon: Database, href: "/plugins?plugin=sql" },
        { name: "Systemd", icon: Server, href: "/plugins?plugin=systemd" },
        { name: "File keywords", icon: FileText, href: "/plugins?plugin=fkm" },
        { name: "X Ping", icon: Network, href: "/plugins?plugin=x-ping" },
        {
          name: "Log tailer",
          icon: FileText,
          href: "/plugins?plugin=log-tailer",
        },
      ],
    },
    {
      title: "OpenTelemetry source templates",
      icon: RadioTower,
      body:
        otelSourceCatalog.length +
        " guided templates for SDKs, Collectors, infrastructure receivers, and cloud telemetry.",
      href: "/opentelemetry/sources",
      link: "Explore OpenTelemetry sources",
      items: [
        { name: "Node.js", icon: Braces },
        { name: "Python", icon: Code2 },
        { name: "Go", icon: Terminal },
        { name: "Java", icon: Code2 },
        { name: "Kubernetes", icon: Server },
        { name: "AWS", icon: Cloud },
      ].map((item) => ({
        ...item,
        href: "/opentelemetry/sources?source=" + encodeURIComponent(item.name),
      })),
    },
  ];
  return (
    <section className="sources-section section-frame marketing-section">
      <div className="section-heading centered">
        <p className="eyebrow">COVERAGE THAT FITS YOUR ESTATE</p>
        <h2>
          Connect your stack.
          <br />
          <span className="muted-heading">Choose how you collect.</span>
        </h2>
        <p>
          Native plugins and OpenTelemetry templates have their own catalogs.
          <br className="desktop-break" /> Use either path, or combine them
          across your environment.
        </p>
      </div>
      <div className="coverage-catalog-grid">
        {groups.map(({ icon: Icon, ...group }) => (
          <Card className="coverage-catalog-card" key={group.href}>
            <Icon size={23} />
            <h3>{group.title}</h3>
            <p>{group.body}</p>
            <div className="source-chip-grid">
              {group.items.map(({ icon: ItemIcon, ...item }) => (
                <SiteLink
                  href={item.href}
                  className="source-chip"
                  key={item.href}
                >
                  <ItemIcon size={18} />
                  {item.name}
                  <ArrowRight size={13} />
                </SiteLink>
              ))}
            </div>
            <SiteLink href={group.href} className="text-link">
              {group.link}
              <ArrowRight size={16} />
            </SiteLink>
          </Card>
        ))}
      </div>
    </section>
  );
}
