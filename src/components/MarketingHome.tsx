import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bot,
  Box,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Globe2,
  Layers3,
  LockKeyhole,
  Network,
  RadioTower,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { NumberedFaq } from "./shadcn-space/NumberedFaq";
import { ProductPreview, ServiceMap } from "./ProductPreview";
import { SiteLink } from "@/lib/navigation";
import { otelSourceCatalog } from "@/otelSourceCatalog";

const collectionModels = [
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    icon: RadioTower,
    tag: "START WITH WHAT YOU HAVE",
    title: "Your telemetry already speaks our language.",
    body: "Send traces, metrics, and logs from your SDKs or existing Collector. Keep your instrumentation, your pipelines, and your freedom to change what comes next.",
    points: [
      "Native OTLP over HTTP and gRPC",
      "Direct SDK or Collector ingestion",
      "Shared service and environment context",
    ],
    source: "SDKs & Collectors",
    code: "OTEL_SERVICE_NAME=checkout-api\nOTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf\nOTEL_EXPORTER_OTLP_ENDPOINT=https://observe.example.com/api/otlp\nOTEL_RESOURCE_ATTRIBUTES=deployment.environment.name=production",
    href: "/docs/opentelemetry",
    link: "Connect OpenTelemetry",
  },
  {
    id: "agent",
    name: "Native agent",
    icon: Cpu,
    tag: "GO CLOSER TO THE SYSTEM",
    title: "See what application telemetry can’t tell you.",
    body: "Bring host, process, filesystem, and private network state into the investigation. Run native plugins near the systems that need them, with controlled enrollment and configuration.",
    points: [
      "Host, process, disk, SQL, and systemd checks",
      "Private endpoints and local file monitoring",
      "mTLS enrollment and signed configuration",
    ],
    source: "Hosts & private networks",
    code: "# Local visibility, inside your boundary\nhost: production-vm-01\ncollection:\n  - cpu & memory\n  - processes & systemd\n  - filesystem & SQL\n  - private network checks",
    href: "/docs/agent",
    link: "Meet the native agent",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    icon: Layers3,
    tag: "THE RIGHT PATH FOR EVERY SIGNAL",
    title: "Open application signals. Deep local context.",
    body: "Use OpenTelemetry across your applications and the NexusObserve agent where proximity matters. Connect both paths to the same services, alerts, and incident workflows.",
    points: [
      "OTLP for application traces, metrics, and logs",
      "Native plugins for operational depth",
      "One place to investigate both",
    ],
    source: "Your entire estate",
    code: "Applications → OpenTelemetry → NexusObserve\n\nHosts & private systems → Native agent ─┘\n\nOne service identity.\nOne incident timeline.\nYour storage and retention.",
    href: "/docs/monitoring-sources",
    link: "Find your collection path",
  },
];

export function CollectionSection() {
  return (
    <section className="collection-section section-frame marketing-section">
      <div className="section-heading centered">
        <p className="eyebrow">MEET YOUR STACK WHERE IT IS</p>
        <h2>
          Bring your signals.
          <br />
          <span className="muted-heading">We’ll connect the dots.</span>
        </h2>
        <p>
          One platform. Three collection paths. Choose what fits your
          environment.
        </p>
      </div>
      <Tabs defaultValue="opentelemetry" className="collection-tabs">
        <TabsList
          className="collection-tabs-list"
          aria-label="Collection paths"
        >
          {collectionModels.map((model) => (
            <TabsTrigger key={model.id} value={model.id}>
              <model.icon size={16} />
              {model.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {collectionModels.map((model) => (
          <TabsContent
            key={model.id}
            value={model.id}
            className="collection-tab-content"
          >
            <div className="collection-copy">
              <p className="eyebrow">{model.tag}</p>
              <h3>{model.title}</h3>
              <p>{model.body}</p>
              <ul>
                {model.points.map((point) => (
                  <li key={point}>
                    <CheckCircle2 size={16} />
                    {point}
                  </li>
                ))}
              </ul>
              <SiteLink href={model.href} className="text-link">
                {model.link}
                <ArrowRight size={16} />
              </SiteLink>
            </div>
            <div className="collection-diagram">
              <div className="collection-code-header">
                <span className="tiny-dot" />
                <span>{model.source}</span>
                <span>nexusobserve</span>
              </div>
              <pre>
                <code>{model.code}</code>
              </pre>
              <div className="pipeline-visual">
                <span>
                  <model.icon size={21} />
                </span>
                <i />
                <span>
                  <Workflow size={21} />
                </span>
                <i />
                <span className="pipeline-destination">
                  <Database size={21} />
                </span>
              </div>
              <div className="pipeline-labels">
                <span>Collect</span>
                <span>Process</span>
                <span>Investigate</span>
              </div>
              <div className="collection-diagram-footer">
                <ShieldCheck size={13} /> Within your infrastructure boundary
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export function FeatureSection() {
  return (
    <section className="feature-section section-frame marketing-section">
      <div className="section-heading feature-heading">
        <div>
          <p className="eyebrow">FROM SIGNALS TO UNDERSTANDING</p>
          <h2>
            Less searching.
            <br />
            <span className="muted-heading">More knowing.</span>
          </h2>
        </div>
        <p>
          When production changes, you need the context to act. Bring the
          application, infrastructure, and incident into the same view.
        </p>
      </div>
      <div className="feature-bento">
        <Card className="feature-card feature-correlate">
          <div className="feature-card-copy">
            <span className="feature-icon">
              <Network size={20} />
            </span>
            <h3>
              Follow the request.
              <br />
              Find the reason.
            </h3>
            <p>
              Move from a slow service to its traces, related logs, and
              infrastructure context. Keep the investigation connected.
            </p>
            <SiteLink href="/product" className="text-link">
              Explore observability
              <ArrowUpRight size={15} />
            </SiteLink>
          </div>
          <div className="feature-map">
            <ServiceMap small />
            <div className="correlation-chips">
              <span>
                <GitBranch size={12} />
                Trace
              </span>
              <span>
                <FileText size={12} />
                Logs
              </span>
              <span>
                <ActivityIcon />
                Metrics
              </span>
            </div>
          </div>
        </Card>
        <Card className="feature-card feature-ai">
          <span className="feature-icon">
            <Sparkles size={20} />
          </span>
          <h3>Your AI. Real context.</h3>
          <p>
            Give local AI clients token-gated MCP access to services, telemetry,
            alerts, and incident evidence.
          </p>
          <div className="ai-mini">
            <div>
              <span className="ai-avatar">
                <Bot size={14} />
              </span>
              <span>
                Investigate checkout latency
                <ArrowUpRight size={12} />
              </span>
            </div>
            <p>
              <span className="ai-step">
                <Check size={11} /> Service context
              </span>
              <span className="ai-step">
                <Check size={11} /> Related traces
              </span>
              <span className="ai-step">
                <Check size={11} /> Recent deployments
              </span>
            </p>
            <div className="ai-mini-evidence">
              <FileText size={12} /> Evidence ready for review
              <span>3 sources</span>
            </div>
          </div>
          <SiteLink href="/docs/mcp" className="text-link">
            Connect your AI client
            <ArrowUpRight size={15} />
          </SiteLink>
        </Card>
        <Card className="feature-card feature-operations">
          <span className="feature-icon">
            <Workflow size={20} />
          </span>
          <h3>Make incidents actionable.</h3>
          <p>
            Connect rules, alerts, ownership, and timelines. Move from a signal
            to a coordinated response.
          </p>
          <div className="incident-mini">
            <span className="incident-mini-icon">
              <AudioLines size={16} />
            </span>
            <div>
              <strong>Payment latency above threshold</strong>
              <small>payment-service · production</small>
            </div>
            <Badge variant="outline">Investigating</Badge>
          </div>
          <div className="incident-timeline">
            <span>
              <i />
              Alert triggered<small>09:42</small>
            </span>
            <span>
              <i />
              Owner assigned<small>09:43</small>
            </span>
            <span>
              <i />
              Evidence attached<small>09:45</small>
            </span>
          </div>
          <SiteLink href="/product" className="text-link">
            Explore operations
            <ArrowUpRight size={15} />
          </SiteLink>
        </Card>
        <Card className="feature-card feature-control">
          <span className="feature-icon">
            <LockKeyhole size={20} />
          </span>
          <h3>Keep control of the whole stack.</h3>
          <p>
            Run the platform on your infrastructure. Choose your retention,
            storage, access policies, and collection model.
          </p>
          <div className="control-visual">
            <div>
              <ShieldCheck size={28} />
              <span>YOUR INFRASTRUCTURE</span>
            </div>
            <span>
              <Database size={14} />
              ClickHouse
            </span>
            <span>
              <Database size={14} />
              Postgres
            </span>
            <span>
              <Server size={14} />
              NexusObserve
            </span>
          </div>
          <SiteLink href="/docs/production" className="text-link">
            Deploy on your terms
            <ArrowUpRight size={15} />
          </SiteLink>
        </Card>
      </div>
    </section>
  );
}

function ActivityIcon() {
  return <AudioLines size={12} />;
}

export function InstallSection() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const installCommand =
    "curl -fsSL https://raw.githubusercontent.com/nexusobserve/nexusobserve/main/scripts/quickstart.sh | sh";
  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <section className="install-section section-frame marketing-section">
      <div className="install-copy">
        <p className="eyebrow">YOUR FIRST SIGNAL STARTS HERE</p>
        <h2>
          A clearer view.
          <br />
          <span className="muted-heading">One command away.</span>
        </h2>
        <p>
          The Docker quick start brings up NexusObserve, Postgres, and
          ClickHouse with persistent storage. Connect your telemetry and start
          exploring.
        </p>
        <SiteLink href="/docs/quickstart" className="text-link">
          Read the quick start
          <ArrowRight size={16} />
        </SiteLink>
        <span className="install-requirement">
          <Box size={14} />
          Docker required · Self-hosted Community Edition
        </span>
      </div>
      <div className="install-terminal">
        <div className="terminal-header">
          <div>
            <span />
            <span />
            <span />
          </div>
          <span>Terminal</span>
          <Terminal size={14} />
        </div>
        <div className="terminal-body">
          <p className="terminal-comment">
            # Your infrastructure. Your observability.
          </p>
          <div className="terminal-command">
            <span>$</span>
            <code>{installCommand}</code>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="terminal-copy"
            onClick={copyInstall}
          >
            {copied ? <Check size={13} /> : <Clipboard size={13} />}
            {copied ? "Copied" : "Copy command"}
          </Button>
          <span className="sr-only" role="status">
            {copied
              ? "Installation command copied."
              : copyError
                ? "Unable to copy. Select the command to copy it manually."
                : ""}
          </span>
          <div className="terminal-output">
            <span>
              <Check size={13} />
              NexusObserve application
            </span>
            <span>
              <Check size={13} />
              Postgres control plane
            </span>
            <span>
              <Check size={13} />
              ClickHouse telemetry storage
            </span>
          </div>
          <div className="terminal-ready">
            <span>→</span> Open localhost:8080 and create your first admin.
          </div>
        </div>
        <div className="terminal-footer">
          <ShieldCheck size={12} />
          Runs in your environment<span>Docker Compose</span>
        </div>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="closing-cta section-frame">
      <div className="cta-orbit" aria-hidden="true" />
      <Badge variant="outline">
        <span className="tiny-dot" />
        BUILT FOR YOUR ENVIRONMENT
      </Badge>
      <h2>
        Your systems.
        <br />
        <span>Your complete picture.</span>
      </h2>
      <p>Open telemetry. Deep operational context. All under your control.</p>
      <div className="hero-actions">
        <Button asChild size="lg" className="main-cta">
          <SiteLink href="/downloads">
            Get started with NexusObserve
            <ArrowRight size={16} />
          </SiteLink>
        </Button>
        <Button asChild size="lg" variant="outline" className="outline-cta">
          <SiteLink href="/docs">
            Explore the docs
            <ArrowUpRight size={15} />
          </SiteLink>
        </Button>
      </div>
    </section>
  );
}

export function MarketingHome() {
  return (
    <div className="marketing-home">
      <section className="premium-hero">
        <div className="hero-orbits" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-noise" aria-hidden="true" />
        <div className="premium-hero-copy section-frame">
          <SiteLink href="/opentelemetry" className="announcement">
            <Badge>OPEN BY DESIGN</Badge>
            <span>Meet your OpenTelemetry workspace</span>
            <ArrowRight size={13} />
          </SiteLink>
          <h1>
            Observe everything.
            <br />
            <span>Own the whole picture.</span>
          </h1>
          <p className="premium-hero-lede">
            Traces, logs, infrastructure, and incident intelligence.
            <br className="desktop-break" /> One connected workspace. On
            infrastructure you control.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg" className="main-cta">
              <SiteLink href="/downloads">
                Get started
                <ArrowRight size={16} />
              </SiteLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="outline-cta">
              <a href="#platform-preview">
                <span className="play-icon">▶</span>Explore the platform
              </a>
            </Button>
          </div>
          <div className="hero-proof">
            <span>
              <Check size={12} />
              Self-hosted
            </span>
            <span>
              <Check size={12} />
              OpenTelemetry native
            </span>
            <span>
              <Check size={12} />
              AI-ready through MCP
            </span>
          </div>
        </div>
        <div className="section-frame">
          <ProductPreview />
        </div>
      </section>
      <section className="ecosystem-band section-frame">
        <p>BUILT ON OPEN STANDARDS. AT HOME IN YOUR STACK.</p>
        <div className="ecosystem-logos">
          <span>
            <RadioTower />
            OpenTelemetry
          </span>
          <span>
            <Box />
            Kubernetes
          </span>
          <span>
            <Layers3 />
            Docker
          </span>
          <span>
            <Database />
            ClickHouse
          </span>
          <span>
            <Cloud />
            Prometheus
          </span>
          <span>
            <Braces />
            MCP
          </span>
        </div>
      </section>
      <FeatureSection />
      <CollectionSection />
      <section className="sources-section section-frame marketing-section">
        <div className="source-grid-decoration" aria-hidden="true" />
        <div className="section-heading centered">
          <p className="eyebrow">A BIGGER VIEW OF YOUR ENVIRONMENT</p>
          <h2>
            Your stack is complex.
            <br />
            <span className="muted-heading">Connecting it shouldn’t be.</span>
          </h2>
          <p>
            Explore {otelSourceCatalog.length}+ source templates for
            applications, infrastructure,
            <br className="desktop-break" /> databases, cloud services, and the
            tools you already run.
          </p>
        </div>
        <div className="source-chip-grid">
          {[
            { name: "Node.js", icon: Braces },
            { name: "Python", icon: Code2 },
            { name: "Go", icon: Terminal },
            { name: "Java", icon: Code2 },
            { name: "PostgreSQL", icon: Database },
            { name: "Redis", icon: Layers3 },
            { name: "Kafka", icon: GitBranch },
            { name: "Kubernetes", icon: Box },
            { name: "AWS", icon: Cloud },
            { name: "Azure", icon: Cloud },
            { name: "Linux", icon: Server },
            { name: "Prometheus", icon: AudioLines },
          ].map(({ name, icon: Icon }) => (
            <SiteLink
              href={`/opentelemetry/sources?source=${encodeURIComponent(name)}`}
              className="source-chip"
              key={name}
            >
              <Icon size={19} />
              {name}
              <ChevronRight size={13} />
            </SiteLink>
          ))}
        </div>
        <SiteLink
          href="/opentelemetry/sources"
          className="text-link sources-link"
        >
          Explore all data sources
          <ArrowRight size={16} />
        </SiteLink>
        <p className="sources-note">
          Guided templates with source-specific configuration and collection
          paths.
        </p>
      </section>
      <InstallSection />
      <section className="faq-section section-frame marketing-section">
        <div className="section-heading">
          <p className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p>
          <h2>
            Good questions.
            <br />
            <span className="muted-heading">Clear answers.</span>
          </h2>
          <p>
            More detail in our{" "}
            <SiteLink href="/docs" className="inline-link">
              documentation
              <ArrowUpRight size={12} />
            </SiteLink>
            .
          </p>
        </div>
        <NumberedFaq
          items={[
            {
              question: "Do I need to install a NexusObserve agent?",
              answer:
                "You can start by sending OTLP directly from your OpenTelemetry SDKs or an existing Collector. Add the native agent when you need local process, filesystem, systemd, SQL, or private network visibility. Hybrid environments can use both paths.",
            },
            {
              question: "Where does my telemetry live?",
              answer:
                "In infrastructure you operate. NexusObserve uses ClickHouse for telemetry and Postgres for control-plane state. You manage storage, retention, network access, and backups as part of your deployment.",
            },
            {
              question: "Can I keep my existing instrumentation?",
              answer:
                "Yes. NexusObserve accepts standard OTLP metrics, logs, and traces over HTTP and gRPC. Existing OpenTelemetry SDKs and Collectors can point to your NexusObserve endpoint without introducing a proprietary instrumentation format.",
            },
            {
              question: "How does AI investigation work?",
              answer:
                "A self-hosted MCP server exposes token-gated tools for querying telemetry, inspecting services and alerts, and gathering incident context. Connect a compatible local AI client and choose the data access you allow.",
            },
            {
              question: "What does the quick start deploy?",
              answer:
                "The Docker quick start starts the NexusObserve application, Postgres, and ClickHouse with persistent volumes. Open localhost:8080 to create the first admin. The production guide covers deployment configuration, TLS, backups, and access policies.",
            },
          ]}
        />
      </section>
      <ClosingCta />
    </div>
  );
}

export function MarketingProduct() {
  return (
    <div className="marketing-product">
      <section className="product-marketing-hero section-frame">
        <Badge variant="outline">
          <span className="tiny-dot" />
          THE NEXUSOBSERVE PLATFORM
        </Badge>
        <h1>
          Every signal.
          <br />
          <span className="gradient-text">Shared context.</span>
        </h1>
        <p>
          Bring application observability, local infrastructure depth, and
          incident workflows into one self-hosted control plane.
        </p>
        <div className="hero-actions">
          <Button asChild size="lg" className="main-cta">
            <SiteLink href="/downloads">
              Start building your view
              <ArrowRight size={16} />
            </SiteLink>
          </Button>
          <Button asChild variant="outline" size="lg" className="outline-cta">
            <SiteLink href="/docs">
              Read the docs
              <ArrowUpRight size={15} />
            </SiteLink>
          </Button>
        </div>
      </section>
      <div className="section-frame">
        <ProductPreview />
      </div>
      <FeatureSection />
      <CollectionSection />
      <section className="platform-architecture section-frame marketing-section">
        <div className="section-heading centered">
          <p className="eyebrow">BUILT TO RUN IN YOUR ENVIRONMENT</p>
          <h2>
            A stack you can understand.
            <br />
            <span className="muted-heading">Infrastructure you can own.</span>
          </h2>
        </div>
        <div className="architecture-grid">
          {[
            {
              icon: RadioTower,
              title: "Collect openly",
              body: "Direct OTLP, upstream Collectors, browser telemetry, cloud exports, and native agents. Choose the right entry point for each signal.",
            },
            {
              icon: Workflow,
              title: "Connect the context",
              body: "The NexusObserve server powers service discovery, query APIs, rule evaluation, incidents, operational modeling, and the console.",
            },
            {
              icon: Database,
              title: "Own the storage",
              body: "ClickHouse stores high-volume telemetry. Postgres stores control-plane state. You decide retention, backups, and infrastructure sizing.",
            },
          ].map((item) => (
            <article key={item.title}>
              <item.icon size={24} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <ClosingCta />
    </div>
  );
}
