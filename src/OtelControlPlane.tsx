import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clipboard,
  Cloud,
  Code2,
  Database,
  Eye,
  FileCode2,
  Filter,
  GitBranch,
  Globe2,
  KeyRound,
  Laptop,
  Network,
  PackageCheck,
  Play,
  Plus,
  RadioTower,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  fieldsForSource,
  generateSourceConfig,
  otelSourceCatalog,
  sourceCategories,
  sourceSignals,
} from "./otelSourceCatalog";
import type { SourceDefinition } from "./otelSourceCatalog";

export type OtelSection =
  | "overview"
  | "setup"
  | "sources"
  | "instrumentation"
  | "fleet"
  | "pipelines"
  | "destinations"
  | "configuration"
  | "rollouts"
  | "health";

type LinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate: (href: string) => void;
};

const sections: Array<{
  id: OtelSection;
  label: string;
  icon: LucideIcon;
  group: "Workspace" | "Manage" | "Operate";
}> = [
  { id: "overview", label: "Overview", icon: Boxes, group: "Workspace" },
  { id: "setup", label: "Setup", icon: Rocket, group: "Workspace" },
  { id: "sources", label: "Data sources", icon: Database, group: "Workspace" },
  { id: "instrumentation", label: "Instrumentation", icon: Code2, group: "Workspace" },
  { id: "fleet", label: "Collector fleet", icon: Server, group: "Manage" },
  { id: "pipelines", label: "Pipelines", icon: Workflow, group: "Manage" },
  { id: "destinations", label: "Destinations", icon: RadioTower, group: "Manage" },
  { id: "configuration", label: "Configuration", icon: Settings2, group: "Operate" },
  { id: "rollouts", label: "Revisions & rollouts", icon: GitBranch, group: "Operate" },
  { id: "health", label: "Health & costs", icon: Activity, group: "Operate" },
];

const fleetRows = [
  { name: "prod-k8s-daemon", kind: "Managed", version: "0.137.0", scope: "prod / us-east", config: "rev-42", state: "Healthy", seen: "18 sec" },
  { name: "prod-k8s-gateway", kind: "Managed", version: "0.137.0", scope: "prod / us-east", config: "rev-42", state: "Healthy", seen: "11 sec" },
  { name: "payments-vm", kind: "GitOps", version: "0.136.0", scope: "prod / eu-west", config: "rev-39", state: "Drift", seen: "34 sec" },
  { name: "staging-cluster", kind: "Managed", version: "0.137.0", scope: "staging", config: "rev-43", state: "Healthy", seen: "22 sec" },
  { name: "legacy-hosts", kind: "Imported", version: "0.128.0", scope: "prod / dc-2", config: "unverified", state: "Attention", seen: "4 min" },
];

const configRows = [
  { name: "Production Kubernetes", scope: "env:prod · platform:k8s", mode: "Managed", desired: "rev-42", effective: "rev-42", observed: "Healthy", drift: "In sync" },
  { name: "Payment services", scope: "team:payments · env:prod", mode: "GitOps", desired: "rev-41", effective: "rev-39", observed: "Receiving", drift: "2 revisions" },
  { name: "Staging defaults", scope: "env:staging", mode: "Managed", desired: "rev-43", effective: "rev-43", observed: "Healthy", drift: "In sync" },
  { name: "Legacy datacenter", scope: "site:dc-2", mode: "Imported", desired: "—", effective: "Imported", observed: "Partial", drift: "Unverified" },
];

const collectorYaml = `receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }
  hostmetrics:
    collection_interval: 30s
    scrapers: { cpu: {}, memory: {}, disk: {}, network: {} }

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
  resource/environment:
    attributes:
      - { key: deployment.environment.name, value: production, action: upsert }
  batch: { send_batch_size: 8192, timeout: 2s }

exporters:
  otlphttp/nexusobserve:
    endpoint: \${env:NEXUSOBSERVE_OTLP_ENDPOINT}
    headers: { authorization: "Bearer \${env:NEXUSOBSERVE_TOKEN}" }
    sending_queue: { enabled: true, queue_size: 5000 }
    retry_on_failure: { enabled: true }

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, resource/environment, batch]
      exporters: [otlphttp/nexusobserve]
    metrics:
      receivers: [otlp, hostmetrics]
      processors: [memory_limiter, resource/environment, batch]
      exporters: [otlphttp/nexusobserve]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, resource/environment, batch]
      exporters: [otlphttp/nexusobserve]`;

function WorkspaceLink({ href, className, children, onNavigate }: LinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {children}
    </a>
  );
}

function getSection(path: string): OtelSection {
  const slug = path.split("/")[2] as OtelSection | undefined;
  return sections.some((item) => item.id === slug) ? slug! : "overview";
}

export function OtelControlPlanePage({
  path,
  copied,
  onCopy,
  onNavigate,
}: {
  path: string;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
  onNavigate: (href: string) => void;
}) {
  const active = getSection(path);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [path]);
  const [environment, setEnvironment] = useState("Production");
  const [notice, setNotice] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  function act(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  }

  return (
    <div className="otel-app-shell">
      <aside className="otel-sidebar">
        <div className="otel-sidebar-title">
          <span className="otel-symbol"><RadioTower size={19} /></span>
          <div><strong>OpenTelemetry</strong><span>Control plane</span></div>
        </div>
        {(["Workspace", "Manage", "Operate"] as const).map((group) => (
          <div className="otel-nav-group" key={group}>
            <span className="otel-nav-label">{group}</span>
            {sections.filter((section) => section.group === group).map((section) => {
              const Icon = section.icon;
              return (
                <WorkspaceLink
                  href={`/opentelemetry/${section.id}`}
                  className={active === section.id ? "otel-nav-item active" : "otel-nav-item"}
                  onNavigate={onNavigate}
                  key={section.id}
                >
                  <Icon size={16} /><span>{section.label}</span>
                  {section.id === "fleet" ? <em>5</em> : null}
                </WorkspaceLink>
              );
            })}
          </div>
        ))}
        <div className="otel-sidebar-help">
          <BookOpen size={17} />
          <div><strong>Need a walkthrough?</strong><span>Use the standalone guides.</span></div>
          <WorkspaceLink href="/guides" onNavigate={onNavigate}>Open guides <ArrowRight size={14} /></WorkspaceLink>
        </div>
      </aside>

      <div className="otel-main">
        <header className="otel-workspace-header">
          <div>
            <p className="otel-breadcrumb"><WorkspaceLink href="/product" onNavigate={onNavigate}>Platform</WorkspaceLink> <span>/</span> OpenTelemetry <span>/</span> {sections.find((item) => item.id === active)?.label}</p>
            <h1>{sections.find((item) => item.id === active)?.label}</h1>
          </div>
          <div className="otel-header-actions">
            <label className="otel-environment-select">
              <Globe2 size={15} />
              <select value={environment} onChange={(event) => setEnvironment(event.target.value)} aria-label="Environment">
                <option>Production</option><option>Staging</option><option>Development</option><option>All environments</option>
              </select>
              <ChevronDown size={14} />
            </label>
            <button className="otel-button ghost" onClick={() => act("Configuration inventory refreshed") }><RefreshCw size={16} /> Refresh</button>
            <button className="otel-button primary" onClick={() => setShowSetup(true)}><Plus size={16} /> Add source</button>
          </div>
        </header>

        <div className="otel-content" ref={contentRef} role="region" aria-label="OpenTelemetry workspace content" tabIndex={0}>
          {active === "overview" ? <Overview onNavigate={onNavigate} /> : null}
          {active === "setup" ? <Setup copied={copied} onCopy={onCopy} onAction={act} /> : null}
          {active === "sources" ? <Sources copied={copied} onCopy={onCopy} onAction={act} /> : null}
          {active === "instrumentation" ? <Instrumentation onNavigate={onNavigate} onAction={act} /> : null}
          {active === "fleet" ? <Fleet onAction={act} /> : null}
          {active === "pipelines" ? <Pipelines onAction={act} /> : null}
          {active === "destinations" ? <Destinations onAction={act} /> : null}
          {active === "configuration" ? <Configuration copied={copied} onCopy={onCopy} onAction={act} /> : null}
          {active === "rollouts" ? <Rollouts onAction={act} /> : null}
          {active === "health" ? <Health /> : null}
        </div>
      </div>

      {showSetup ? <QuickSetup onClose={() => setShowSetup(false)} onNavigate={onNavigate} /> : null}
      {notice ? <div className="otel-toast"><CheckCircle2 size={17} />{notice}</div> : null}
    </div>
  );
}

function PageIntro({ title, body, aside }: { title: string; body: string; aside?: React.ReactNode }) {
  return <div className="otel-page-intro"><div><h2>{title}</h2><p>{body}</p></div>{aside}</div>;
}

function MetricCard({ label, value, note, state = "good" }: { label: string; value: string; note: string; state?: "good" | "warn" | "plain" }) {
  return <article className={`otel-metric ${state}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function StatePill({ value }: { value: string }) {
  const tone = /healthy|in sync|receiving|connected|managed|ready/i.test(value) ? "good" : /drift|attention|partial|unverified/i.test(value) ? "warn" : "plain";
  return <span className={`otel-state ${tone}`}><span />{value}</span>;
}

function Overview({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <>
      <PageIntro title="Your telemetry, one configuration model." body="Connect any OpenTelemetry source, manage enrolled collectors, and prove that the configuration you intended is the configuration actually running." aside={<WorkspaceLink href="/guides/choose-a-deployment-model" className="otel-text-link" onNavigate={onNavigate}>Read deployment guide <ArrowRight size={15} /></WorkspaceLink>} />
      <div className="otel-metric-grid">
        <MetricCard label="Connected services" value="47" note="6 added this week" />
        <MetricCard label="Collector instances" value="5" note="4 healthy · 1 needs attention" state="warn" />
        <MetricCard label="Config coverage" value="92%" note="Desired and effective state verified" />
        <MetricCard label="Ingest volume" value="184 GB/day" note="Down 11% after sampling" state="plain" />
      </div>

      <div className="otel-dashboard-grid">
        <section className="otel-panel span-2">
          <div className="otel-panel-head"><div><span className="otel-kicker">Configuration reconciliation</span><h3>Desired → effective → observed</h3></div><StatePill value="1 drifted" /></div>
          <div className="reconcile-list">
            {configRows.slice(0, 3).map((row) => <div className="reconcile-row" key={row.name}><div className="reconcile-name"><span className={`mode-icon ${row.mode.toLowerCase()}`}><Settings2 size={15} /></span><div><strong>{row.name}</strong><small>{row.scope}</small></div></div><div><small>Desired</small><strong>{row.desired}</strong></div><ArrowRight size={15} /><div><small>Effective</small><strong>{row.effective}</strong></div><ArrowRight size={15} /><StatePill value={row.drift} /></div>)}
          </div>
          <WorkspaceLink href="/opentelemetry/configuration" className="otel-panel-link" onNavigate={onNavigate}>Open centralized configuration <ArrowRight size={15} /></WorkspaceLink>
        </section>

        <section className="otel-panel">
          <div className="otel-panel-head"><div><span className="otel-kicker">Get useful quickly</span><h3>Setup progress</h3></div><strong className="progress-number">3 / 4</strong></div>
          <div className="setup-checks">
            {[['Create OTLP endpoint', true], ['Connect first service', true], ['Verify telemetry', true], ['Create production rollout', false]].map(([label, done]) => <div key={String(label)} className={done ? "done" : ""}><span>{done ? <Check size={14} /> : "4"}</span><p>{label}</p></div>)}
          </div>
          <WorkspaceLink href="/opentelemetry/setup" className="otel-button secondary full-width" onNavigate={onNavigate}>Continue setup <ArrowRight size={15} /></WorkspaceLink>
        </section>

        <section className="otel-panel">
          <div className="otel-panel-head"><div><span className="otel-kicker">Signal health</span><h3>Last 30 minutes</h3></div></div>
          <div className="signal-health-list">
            {[['Traces','38.2k spans/s','99.99%'],['Metrics','142k points/s','99.98%'],['Logs','21.4k records/s','99.96%']].map(([name, rate, success], index) => <div key={name}><span className={`signal-dot signal-${index}`} /><strong>{name}</strong><small>{rate}</small><em>{success}</em></div>)}
          </div>
        </section>

        <section className="otel-panel span-2">
          <div className="otel-panel-head"><div><span className="otel-kicker">Recent activity</span><h3>Configuration changes</h3></div><WorkspaceLink href="/opentelemetry/rollouts" onNavigate={onNavigate}>View all</WorkspaceLink></div>
          <div className="activity-list">
            <div><span className="activity-icon"><Rocket size={15} /></span><p><strong>rev-43 deployed to staging</strong><small>Canary completed with no health regression</small></p><time>12 min ago</time></div>
            <div><span className="activity-icon"><AlertTriangle size={15} /></span><p><strong>Drift detected on payments-vm</strong><small>Running rev-39; desired state is rev-41</small></p><time>34 min ago</time></div>
            <div><span className="activity-icon"><ShieldCheck size={15} /></span><p><strong>Secret reference rotated</strong><small>OTLP destination token updated without exposing its value</small></p><time>2 hr ago</time></div>
          </div>
        </section>
      </div>
    </>
  );
}

function Setup({ copied, onCopy, onAction }: { copied: string | null; onCopy: (value: string, label: string) => void; onAction: (message: string) => void }) {
  const [model, setModel] = useState("Managed collector");
  const snippets: Record<string, string> = {
    "Direct OTLP": `export OTEL_SERVICE_NAME=checkout-api\nexport OTEL_EXPORTER_OTLP_ENDPOINT=https://otel.example.com\nexport OTEL_EXPORTER_OTLP_HEADERS=authorization=Bearer%20\u003cTOKEN\u003e`,
    "Managed collector": `docker run --rm \\\n  -e NEXUSOBSERVE_ENROLLMENT_TOKEN=\u003cONE_TIME_TOKEN\u003e \\\n  -e NEXUSOBSERVE_CONTROL_URL=https://observe.example.com \\\n  -v otel-state:/var/lib/otelcol \\\n  nexusobserve/otel-collector:latest`,
    "Kubernetes": `helm upgrade --install nexus-otel open-telemetry/opentelemetry-collector \\\n  --namespace observability --create-namespace \\\n  -f nexusobserve-values.yaml`,
    "GitOps": `apiVersion: observability.nexusobserve.io/v1alpha1\nkind: TelemetryPipeline\nmetadata:\n  name: production-defaults\nspec:\n  source: git\n  path: otel/production.yaml`,
  };
  return <>
    <PageIntro title="Choose ownership before topology." body="A gateway is optional. Select the deployment model that matches who should own and apply configuration; NexusObserve adapts the workflow." />
    <div className="deployment-models">
      {[
        {name:'Direct OTLP', icon:Zap, body:'Fastest validation path for SDK telemetry. No Collector required.'},
        {name:'Managed collector', icon:RadioTower, body:'Enroll through OpAMP for remote configuration, inventory and drift detection.', recommended:true},
        {name:'Kubernetes', icon:Boxes, body:'Generate Operator CRs or Helm values for agent, gateway or combined layouts.'},
        {name:'GitOps', icon:GitBranch, body:'Keep Git authoritative while NexusObserve validates and observes effective state.'},
      ].map((item) => { const Icon=item.icon; return <button key={item.name} className={model===item.name?'deployment-card selected':'deployment-card'} onClick={()=>setModel(item.name)}><span className="deployment-check">{model===item.name?<Check size={14}/>:null}</span><Icon size={22}/>{item.recommended?<em>Recommended</em>:null}<strong>{item.name}</strong><small>{item.body}</small></button>})}
    </div>
    <section className="otel-panel setup-output">
      <div className="otel-panel-head"><div><span className="otel-kicker">Generated setup</span><h3>{model}</h3></div><StatePill value="Ready" /></div>
      <div className="setup-output-grid"><div><h4>What NexusObserve will do</h4><ul className="otel-check-list"><li><CheckCircle2 size={15}/>Create a scoped OTLP endpoint and secret reference</li><li><CheckCircle2 size={15}/>Apply resource naming and environment conventions</li><li><CheckCircle2 size={15}/>Enable Collector self-telemetry and health reporting</li><li><CheckCircle2 size={15}/>Verify traces, metrics and logs independently</li></ul><button className="otel-button primary" onClick={()=>onAction(`${model} setup saved as a draft`)}>Save setup draft</button></div><div className="otel-code"><button onClick={()=>onCopy(snippets[model], `setup-${model}`)}><Clipboard size={14}/>{copied===`setup-${model}`?'Copied':'Copy'}</button><pre><code>{snippets[model]}</code></pre></div></div>
    </section>
  </>;
}

function sourceIcon(source: SourceDefinition): LucideIcon {
  if (source.category === "Applications & APM") return Code2;
  if (source.category === "Hosts & operating systems") return Server;
  if (source.category === "Containers & orchestration") return Boxes;
  if (source.category === "Cloud platforms") return Cloud;
  if (source.category === "Metrics & protocols") return Activity;
  if (source.category === "Databases & storage") return Database;
  if (source.category === "Messaging & streaming") return Network;
  if (source.category === "Web, proxy & service mesh") return Globe2;
  if (source.category === "Logs, security & events") return FileCode2;
  if (source.category === "Network & synthetics") return Zap;
  if (source.category === "Developer systems") return GitBranch;
  if (source.category === "Experience & profiling") return Laptop;
  return Workflow;
}

function Sources({
  copied,
  onCopy,
  onAction,
}: {
  copied: string | null;
  onCopy: (value: string, label: string) => void;
  onAction: (message: string) => void;
}) {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("source") ?? "");
  const [category, setCategory] = useState("All sources");
  const [signal, setSignal] = useState("All signals");
  const [collection, setCollection] = useState("All methods");
  const [selected, setSelected] = useState<SourceDefinition | null>(null);
  const connected = new Set(["otlp", "kubernetes", "linux", "prometheus", "postgresql", "browser-rum"]);
  const filtered = otelSourceCatalog.filter((source) =>
    (category === "All sources" || source.category === category) &&
    (signal === "All signals" || source.signals.includes(signal as (typeof source.signals)[number])) &&
    (collection === "All methods" || source.collectionType === collection) &&
    `${source.name} ${source.description} ${source.receiver} ${source.collectionType}`.toLowerCase().includes(query.toLowerCase()),
  );
  const grouped = sourceCategories
    .map((name) => ({ name, sources: filtered.filter((source) => source.category === name) }))
    .filter((group) => group.sources.length > 0);

  return <>
    <PageIntro title="Your stack. A clear path to connect it." body="Find a source, choose its collection method, and generate a starter configuration. Explore applications, infrastructure, databases, cloud services, and existing telemetry pipelines." aside={<span className="catalog-count"><strong>{otelSourceCatalog.length}</strong> source templates</span>} />
    <div className="source-type-strip">
      {Array.from(new Set(otelSourceCatalog.map((source) => source.collectionType))).map((type) => {
        const count = otelSourceCatalog.filter((source) => source.collectionType === type).length;
        return <button className={collection === type ? "active" : ""} key={type} onClick={() => setCollection(collection === type ? "All methods" : type)}><strong>{count}</strong><span>{type}</span></button>;
      })}
    </div>
    <div className="source-category-tabs">
      {["All sources", ...sourceCategories].map((item) => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}{item !== "All sources" ? <span>{otelSourceCatalog.filter((source) => source.category === item).length}</span> : null}</button>)}
    </div>
    <div className="catalog-toolbar source-toolbar">
      <label><Search size={16}/><input aria-label="Search data sources" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by source, receiver or collection method" /></label>
      <label><Filter size={15}/><select aria-label="Filter by signal" value={signal} onChange={(e)=>setSignal(e.target.value)}><option>All signals</option>{sourceSignals.map((item)=><option key={item}>{item}</option>)}</select><ChevronDown size={14}/></label>
    </div>
    <div className="catalog-result-row"><span>Showing <strong>{filtered.length}</strong> of {otelSourceCatalog.length} sources</span>{query || category !== "All sources" || signal !== "All signals" || collection !== "All methods" ? <button onClick={()=>{setQuery("");setCategory("All sources");setSignal("All signals");setCollection("All methods")}}>Clear filters <X size={13}/></button> : null}</div>
    {grouped.map((group) => <section className="source-group" key={group.name}>
      <div className="source-group-heading"><h3>{group.name}</h3><span>{group.sources.length} {group.sources.length === 1 ? "source" : "sources"}</span></div>
      <div className="source-grid">{group.sources.map((source)=>{const Icon=sourceIcon(source);return <article className="source-card source-card-expanded" key={source.id}>
        <div className="source-card-top"><span><Icon size={20}/></span>{connected.has(source.id)?<StatePill value="Connected"/>:<span className={`maturity maturity-${source.maturity.toLowerCase()}`}>{source.maturity}</span>}</div>
        <span className="source-method">{source.collectionType}</span><h3>{source.name}</h3><p>{source.description}</p>
        <div className="source-signals">{source.signals.map((item)=><span key={item}>{item}</span>)}</div>
        <div className="source-component"><code>{source.receiver}</code><span>{source.availability}</span></div>
        <button onClick={()=>setSelected(source)}>{connected.has(source.id)?"Manage":"Configure"} <ArrowRight size={14}/></button>
      </article>})}</div>
    </section>)}
    {filtered.length === 0 ? <div className="empty-catalog"><Search size={24}/><h3>No matching source</h3><p>Clear the filters or use the custom Collector receiver to add any standard component.</p><button className="otel-button secondary" onClick={()=>{setQuery("");setCategory("All sources");setSignal("All signals");setCollection("All methods")}}>Clear filters</button></div> : null}
    {selected ? <SourceSetupDrawer source={selected} copied={copied} onCopy={onCopy} onClose={()=>setSelected(null)} onAction={onAction} /> : null}
  </>;
}

function SourceSetupDrawer({
  source,
  copied,
  onCopy,
  onClose,
  onAction,
}: {
  source: SourceDefinition;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
  onClose: () => void;
  onAction: (message: string) => void;
}) {
  const fields = fieldsForSource(source);
  const [values, setValues] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"about" | "configure" | "preview">("about");
  const config = generateSourceConfig(source, values);
  const Icon = sourceIcon(source);

  return <div className="otel-modal-backdrop source-drawer-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="source-drawer" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={(e)=>e.stopPropagation()}>
      <header><div className="source-drawer-identity"><span><Icon size={21}/></span><div><small>{source.category}</small><h2 id="source-title">{source.name}</h2></div></div><button onClick={onClose} aria-label="Close"><X size={18}/></button></header>
      <nav className="drawer-steps">{[["about","1","Overview"],["configure","2","Configure"],["preview","3","Preview YAML"]].map(([id,number,label])=><button className={step===id?"active":""} onClick={()=>setStep(id as typeof step)} key={id}><span>{number}</span>{label}</button>)}</nav>
      <div className="source-drawer-body">
        {step === "about" ? <>
          <p className="source-long-description">{source.description}</p>
          <div className="source-facts"><div><span>Collection method</span><strong>{source.collectionType}</strong></div><div><span>Collector component</span><code>{source.receiver}</code></div><div><span>Nexus template maturity</span><StatePill value={source.maturity}/></div><div><span>Template</span><strong>{source.availability}</strong></div></div>
          <div className="drawer-section"><h3>Signals collected</h3><div className="large-signal-list">{source.signals.map((item)=><span key={item}><CheckCircle2 size={14}/>{item}</span>)}</div></div>
          <div className="drawer-section"><h3>Supported deployment roles</h3><div className="deployment-tags">{source.deployments.map((item)=><span key={item}>{item === "Gateway" ? <RadioTower size={14}/> : item === "Application" ? <Code2 size={14}/> : item === "Cloud" ? <Cloud size={14}/> : item === "Cluster" ? <Boxes size={14}/> : <Server size={14}/>} {item}</span>)}</div><p>A gateway is available where useful, but is never required solely to use NexusObserve.</p></div>
          <div className="drawer-note"><ShieldCheck size={18}/><p><strong>Standard configuration remains visible.</strong><span>The generated output uses OTel components and environment-backed secret references.</span></p></div>
        </> : null}
        {step === "configure" ? <>
          <div className="drawer-section first"><h3>Source settings</h3><p>These values produce a starter configuration. Validate component-specific options before a production rollout.</p></div>
          {fields.length ? <div className="source-form">{fields.map((field)=><label key={field.key}><span>{field.label}{field.optional?<em>Optional</em>:null}</span><div>{field.secret?<KeyRound size={15}/>:field.key.includes("endpoint")?<Globe2 size={15}/>:<Settings2 size={15}/>}<input type={field.secret?"password":"text"} value={values[field.key]||""} onChange={(e)=>setValues({...values,[field.key]:e.target.value})} placeholder={field.placeholder}/></div>{field.secret?<small>Use a secret reference; raw credentials are never placed in revisions.</small>:null}</label>)}</div> : <div className="no-fields"><FileCode2 size={23}/><h3>No credentials required</h3><p>This template can be rendered immediately and edited before deployment.</p></div>}
          <div className="drawer-section"><h3>Configuration ownership</h3><div className="drawer-mode-options"><button className="active"><RadioTower size={16}/><span><strong>Managed</strong><small>Push with OpAMP</small></span><Check size={14}/></button><button><GitBranch size={16}/><span><strong>GitOps</strong><small>Open a pull request</small></span></button><button><FileCode2 size={16}/><span><strong>Generate only</strong><small>Download and apply</small></span></button></div></div>
        </> : null}
        {step === "preview" ? <>
          <div className="drawer-section first"><div className="drawer-section-head"><div><h3>Generated starter configuration</h3><p>Standard Collector YAML with resource identity, memory protection and batching.</p></div><StatePill value="Review required"/></div></div>
          <div className="otel-code source-preview-code"><button onClick={()=>onCopy(config,`source-${source.id}`)}><Clipboard size={14}/>{copied===`source-${source.id}`?'Copied':'Copy YAML'}</button><pre><code>{config}</code></pre></div>
          <div className="preview-checks"><span><CheckCircle2 size={14}/>Secret values referenced from runtime</span><span><CheckCircle2 size={14}/>NexusObserve source identity attached</span><span><AlertTriangle size={14}/>Run distribution-aware validation before deployment</span></div>
        </> : null}
      </div>
      <footer><button className="otel-button ghost" onClick={onClose}>Cancel</button>{step!=="about"?<button className="otel-button secondary" onClick={()=>setStep(step==="preview"?"configure":"about")}>Back</button>:null}<button className="otel-button primary" onClick={()=>{if(step==="about")setStep("configure");else if(step==="configure")setStep("preview");else{onAction(`${source.name} configuration saved as a draft`);onClose()}}}>{step==="preview"?"Save draft":"Continue"}<ArrowRight size={14}/></button></footer>
    </section>
  </div>;
}

function Instrumentation({ onNavigate, onAction }: { onNavigate: (href: string) => void; onAction: (message: string) => void }) {
  const languages = [
    ["Java", "7 services", "94%", "Auto + SDK", "Healthy"], ["Node.js", "12 services", "89%", "Auto + SDK", "Healthy"], ["Python", "9 services", "82%", "Auto + SDK", "3 warnings"], ["Go", "8 services", "96%", "SDK", "Healthy"], [".NET", "6 services", "91%", "Auto + SDK", "Healthy"], ["Browser", "5 apps", "76%", "Web SDK", "Needs review"],
  ];
  return <>
    <PageIntro title="Instrumentation that remains standard OpenTelemetry." body="Generate language-specific setup without hiding the environment variables, packages or resource attributes. Track whether each service is actually producing useful telemetry." aside={<button className="otel-button secondary" onClick={()=>onAction('Instrumentation setup opened')}><Plus size={15}/>Instrument service</button>} />
    <section className="otel-panel no-padding"><div className="data-table instrument-table"><div className="data-row data-head"><span>Runtime</span><span>Coverage</span><span>Method</span><span>Readiness</span><span /></div>{languages.map(([name,count,coverage,method,status])=><div className="data-row" key={name}><span className="language-cell"><span>{name.slice(0,2)}</span><strong>{name}</strong><small>{count}</small></span><span><strong>{coverage}</strong><small>services reporting</small></span><span>{method}</span><StatePill value={status}/><button onClick={()=>onAction(`${name} instructions opened`)}>Configure <ArrowRight size={14}/></button></div>)}</div></section>
    <div className="otel-callout"><ShieldCheck size={20}/><div><strong>Resource identity policy</strong><p>Every service should report service.name, service.namespace, service.version, deployment.environment.name and team ownership. Missing identity is surfaced before it becomes broken correlation.</p></div><WorkspaceLink href="/guides/instrument-an-application" onNavigate={onNavigate}>Open guide <ArrowRight size={14}/></WorkspaceLink></div>
  </>;
}

function Fleet({ onAction }: { onAction: (message: string) => void }) {
  const [selected, setSelected] = useState(fleetRows[0]);
  return <>
    <PageIntro title="One inventory, honest levels of control." body="Managed collectors can receive configuration. GitOps collectors reconcile through source control. Imported collectors remain read-only until they explicitly enroll." aside={<button className="otel-button primary" onClick={()=>onAction('Enrollment token created for 15 minutes')}><Plus size={15}/>Enroll collector</button>} />
    <section className="otel-panel no-padding"><div className="fleet-summary"><span><i className="dot good"/>4 healthy</span><span><i className="dot warn"/>1 needs attention</span><span><PackageCheck size={15}/>Latest: 0.137.0</span><span><RefreshCw size={15}/>Seen within 5 minutes</span></div><div className="data-table fleet-table"><div className="data-row data-head"><span>Collector</span><span>Ownership</span><span>Version</span><span>Effective config</span><span>Status</span><span>Last seen</span></div>{fleetRows.map((row)=><button className={selected.name===row.name?'data-row selected':'data-row'} key={row.name} onClick={()=>setSelected(row)}><span><strong>{row.name}</strong><small>{row.scope}</small></span><StatePill value={row.kind}/><span>{row.version}</span><span>{row.config}</span><StatePill value={row.state}/><span>{row.seen}</span></button>)}</div></section>
    <section className="otel-panel collector-detail"><div className="otel-panel-head"><div><span className="otel-kicker">Selected collector</span><h3>{selected.name}</h3></div><div className="inline-actions"><button className="otel-button ghost" onClick={()=>onAction(`Diagnostics requested from ${selected.name}`)}><Activity size={15}/>Diagnostics</button><button className="otel-button secondary" onClick={()=>onAction(`Configuration for ${selected.name} opened`)}><Eye size={15}/>View effective config</button></div></div><div className="detail-stat-grid"><div><span>Ownership</span><strong>{selected.kind}</strong></div><div><span>CPU / memory</span><strong>0.7 core · 384 MiB</strong></div><div><span>Export success</span><strong>99.98%</strong></div><div><span>Queue utilization</span><strong>8.2%</strong></div></div></section>
  </>;
}

function FlowDiagram({ source = "OTLP + hostmetrics", destination = "NexusObserve" }: { source?: string; destination?: string }) {
  return <div className="pipeline-flow"><span><RadioTower size={17}/><small>Receivers</small><strong>{source}</strong></span><ArrowRight size={17}/><span><SlidersHorizontal size={17}/><small>Processors</small><strong>Protect · enrich · batch</strong></span><ArrowRight size={17}/><span><Zap size={17}/><small>Exporters</small><strong>{destination}</strong></span></div>;
}

function Pipelines({ onAction }: { onAction: (message: string) => void }) {
  const pipelines = [
    {name:'Production application telemetry', scope:'env:prod', status:'Healthy', data:'38.2k spans/s · 142k metrics/s', processors:['memory limiter','resource policy','tail sampling','batch']},
    {name:'Kubernetes infrastructure', scope:'platform:k8s', status:'Healthy', data:'63.4k metrics/s · 8.1k logs/s', processors:['k8s attributes','filter noise','redact secrets','batch']},
    {name:'Security and audit logs', scope:'log.type:audit', status:'Attention', data:'2.8k logs/s · 1.4% rejected', processors:['parse JSON','PII redaction','severity map','routing']},
  ];
  return <>
    <PageIntro title="Build safe pipelines without losing the YAML." body="Compose receivers, processors and exporters visually; validate against the real Collector schema; then inspect the exact standard configuration that will run." aside={<button className="otel-button primary" onClick={()=>onAction('Blank pipeline draft created')}><Plus size={15}/>New pipeline</button>} />
    <div className="pipeline-list">{pipelines.map((pipeline)=><article className="otel-panel" key={pipeline.name}><div className="otel-panel-head"><div><span className="otel-kicker">{pipeline.scope}</span><h3>{pipeline.name}</h3></div><StatePill value={pipeline.status}/></div><FlowDiagram destination={pipeline.name.includes('Security')?'NexusObserve + SIEM':'NexusObserve'}/><div className="pipeline-footer"><div>{pipeline.processors.map((processor)=><span key={processor}>{processor}</span>)}</div><small>{pipeline.data}</small><button onClick={()=>onAction(`${pipeline.name} opened in editor`)}>Edit pipeline <ArrowRight size={14}/></button></div></article>)}</div>
  </>;
}

function Destinations({ onAction }: { onAction: (message: string) => void }) {
  const destinations = [
    {name:'NexusObserve primary', type:'OTLP/HTTP', endpoint:'https://otel.prod.example.com', status:'Healthy', share:'100% traces · metrics · logs'},
    {name:'Security archive', type:'S3', endpoint:'s3://company-audit-archive/otel', status:'Healthy', share:'Audit logs only'},
    {name:'Migration mirror', type:'OTLP/gRPC', endpoint:'https://third-party.example.com:4317', status:'Paused', share:'10% traces'},
  ];
  return <>
    <PageIntro title="Route telemetry without locking it in." body="NexusObserve is the default destination, not the only destination. Dual-ship, archive or migrate using normal OTel exporters and scoped secret references." aside={<button className="otel-button primary" onClick={()=>onAction('Destination form opened')}><Plus size={15}/>Add destination</button>} />
    <div className="destination-grid">{destinations.map((item)=><article className="destination-card" key={item.name}><div><span className="destination-icon"><RadioTower size={20}/></span><StatePill value={item.status}/></div><span className="otel-kicker">{item.type}</span><h3>{item.name}</h3><code>{item.endpoint}</code><p>{item.share}</p><div><KeyRound size={15}/><span>Credential stored as secret reference</span></div><button onClick={()=>onAction(`${item.name} connection test passed`)}><Play size={14}/>Test connection</button><button onClick={()=>onAction(`${item.name} opened`)}>Manage</button></article>)}</div>
    <div className="otel-callout"><ShieldCheck size={20}/><div><strong>Secrets never enter generated YAML</strong><p>The configuration stores references such as <code>secret://otel/production-token</code>. Runtime values come from the customer-selected secret provider.</p></div></div>
  </>;
}

function Configuration({ copied, onCopy, onAction }: { copied: string | null; onCopy: (value: string, label: string) => void; onAction: (message: string) => void }) {
  const [showYaml, setShowYaml] = useState(false);
  const [query, setQuery] = useState("");
  const rows = useMemo(()=>configRows.filter((row)=>`${row.name} ${row.scope} ${row.mode}`.toLowerCase().includes(query.toLowerCase())),[query]);
  return <>
    <PageIntro title="The complete configuration picture." body="Compare intended, running and observed state across every environment. Every value includes its source and confidence; unmanaged systems are never presented as verified." aside={<button className="otel-button primary" onClick={()=>onAction('New configuration draft created')}><Plus size={15}/>New configuration</button>} />
    <div className="config-legend"><span><i className="dot desired"/>Desired <small>saved in NexusObserve</small></span><span><i className="dot effective"/>Effective <small>reported by collector</small></span><span><i className="dot observed"/>Observed <small>confirmed from telemetry</small></span></div>
    <section className="otel-panel no-padding"><div className="table-toolbar"><label><Search size={16}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search configurations"/></label><button className="otel-button ghost" onClick={()=>setShowYaml(!showYaml)}><FileCode2 size={15}/>{showYaml?'Hide YAML':'View rendered YAML'}</button></div><div className="data-table config-table"><div className="data-row data-head"><span>Configuration</span><span>Ownership</span><span>Desired</span><span>Effective</span><span>Observed</span><span>Drift</span></div>{rows.map((row)=><div className="data-row" key={row.name}><span><strong>{row.name}</strong><small>{row.scope}</small></span><StatePill value={row.mode}/><span className="revision-tag">{row.desired}</span><span className="revision-tag">{row.effective}</span><StatePill value={row.observed}/><StatePill value={row.drift}/></div>)}</div></section>
    {showYaml?<section className="otel-panel config-yaml"><div className="otel-panel-head"><div><span className="otel-kicker">Rendered output</span><h3>Production Kubernetes · rev-42</h3></div><button className="otel-button ghost" onClick={()=>onCopy(collectorYaml,'config-yaml')}><Clipboard size={14}/>{copied==='config-yaml'?'Copied':'Copy YAML'}</button></div><div className="otel-code"><pre><code>{collectorYaml}</code></pre></div></section>:null}
    <div className="ownership-grid">{[
      ['Managed','Push through OpAMP; report effective state and component health.',RadioTower],['GitOps','Generate pull requests; observe deployment and drift without overriding Git.',GitBranch],['Generated','Export YAML, Helm, Operator CRs, Docker or environment variables.',FileCode2],['Imported','Visualize and validate current config; remain read-only until enrolled.',Eye],
    ].map(([title,body,Icon])=><article key={String(title)}><span><Icon size={18}/></span><strong>{title as string}</strong><p>{body as string}</p></article>)}</div>
  </>;
}

function Rollouts({ onAction }: { onAction: (message: string) => void }) {
  const [strategy, setStrategy] = useState("Canary");
  return <>
    <PageIntro title="Change configuration like production software." body="Validate, preview impact, canary to a small group, watch health and automatically preserve the last-known-good revision." aside={<button className="otel-button primary" onClick={()=>onAction('Rollout planner opened for rev-44')}><Rocket size={15}/>Plan rollout</button>} />
    <div className="rollout-layout"><section className="otel-panel"><div className="otel-panel-head"><div><span className="otel-kicker">Pending draft</span><h3>rev-44 · reduce noisy health logs</h3></div><StatePill value="Validated"/></div><div className="change-summary"><div><strong>4</strong><span>components changed</span></div><div><strong>−18%</strong><span>estimated log volume</span></div><div><strong>0</strong><span>schema errors</span></div></div><FlowDiagram source="filelog + OTLP"/><h4>Rollout strategy</h4><div className="strategy-picker">{['Canary','Progressive','All at once'].map((item)=><button className={strategy===item?'active':''} onClick={()=>setStrategy(item)} key={item}><span>{strategy===item?<Check size={13}/>:null}</span><strong>{item}</strong><small>{item==='Canary'?'1 collector, then approve':item==='Progressive'?'10% → 25% → 100%':'Every matching collector'}</small></button>)}</div><div className="rollout-actions"><button className="otel-button secondary" onClick={()=>onAction('Dry run passed: 5 collectors compatible')}><Play size={15}/>Run dry validation</button><button className="otel-button primary" onClick={()=>onAction(`${strategy} rollout started for rev-44`)}><Rocket size={15}/>Start {strategy.toLowerCase()}</button></div></section><section className="otel-panel"><div className="otel-panel-head"><div><span className="otel-kicker">Revision history</span><h3>Production defaults</h3></div></div><div className="revision-timeline">{[
      ['rev-43','Staging resource policy','Staging','12 min ago'],['rev-42','Production baseline','Production','2 days ago'],['rev-41','Tail sampling update','Rolled back','6 days ago'],['rev-40','PII redaction policy','Production','12 days ago']
    ].map(([rev,title,state,time],index)=><div key={rev}><span className={index===0?'latest':''}>{index===0?<Check size={13}/>:null}</span><p><strong>{rev} · {title}</strong><small>{state} · {time}</small></p><button onClick={()=>onAction(`${rev} diff opened`)}>View diff</button></div>)}</div></section></div>
    <div className="safety-grid"><article><ShieldCheck size={20}/><strong>Preflight validation</strong><p>Schema, component availability, secrets, endpoints and resource budgets.</p></article><article><Activity size={20}/><strong>Health gates</strong><p>Reject rates, queue pressure, memory, restarts and signal continuity.</p></article><article><RefreshCw size={20}/><strong>Last-known-good</strong><p>Automatic or one-click rollback with complete audit history.</p></article></div>
  </>;
}

function Health() {
  const components = [
    ['OTLP receiver','Healthy','38.2k req/s','0.01% rejected'],['Prometheus receiver','Healthy','24 targets','0 scrape errors'],['Tail sampling','Healthy','31% retained','4.1 ms decision'],['Batch processor','Healthy','8,192 avg batch','2.0 sec timeout'],['Primary exporter','Healthy','99.98% success','8.2% queue'],['Audit pipeline','Attention','98.6% success','1.4% parse errors'],
  ];
  return <>
    <PageIntro title="Performance, reliability and spend in the same view." body="Collector efficiency is not a promise based on configuration alone. Measure throughput, queue pressure, rejection, CPU, memory and bytes retained for every revision." />
    <div className="otel-metric-grid"><MetricCard label="Export success" value="99.98%" note="Across all signals"/><MetricCard label="Collector CPU" value="3.4 cores" note="Across 5 instances" state="plain"/><MetricCard label="Memory" value="1.82 GiB" note="42% below configured limits"/><MetricCard label="Estimated storage" value="$1,840/mo" note="11% lower than previous revision" state="plain"/></div>
    <div className="health-layout"><section className="otel-panel no-padding"><div className="otel-panel-head padded"><div><span className="otel-kicker">Component health</span><h3>Pipeline performance</h3></div><span className="live-indicator"><i/>Live</span></div><div className="data-table health-table"><div className="data-row data-head"><span>Component</span><span>Status</span><span>Throughput</span><span>Errors / pressure</span></div>{components.map(([name,status,throughput,error])=><div className="data-row" key={name}><strong>{name}</strong><StatePill value={status}/><span>{throughput}</span><span>{error}</span></div>)}</div></section><section className="otel-panel"><div className="otel-panel-head"><div><span className="otel-kicker">Volume by signal</span><h3>Daily retained data</h3></div><CircleDollarSign size={19}/></div><div className="volume-bars">{[['Traces','61 GB','33%'],['Metrics','49 GB','27%'],['Logs','74 GB','40%']].map(([name,value,width],index)=><div key={name}><p><strong>{name}</strong><span>{value}</span></p><span><i className={`bar-${index}`} style={{width}}/></span></div>)}</div><div className="cost-tip"><Zap size={17}/><p><strong>Potential saving: $286/month</strong><span>Drop Kubernetes health-check logs after verifying the proposed filter.</span></p></div></section></div>
  </>;
}

function QuickSetup({ onClose, onNavigate }: { onClose: () => void; onNavigate: (href: string) => void }) {
  return <div className="otel-modal-backdrop" role="presentation" onMouseDown={onClose}><section className="otel-modal" role="dialog" aria-modal="true" aria-labelledby="quick-setup-title" onMouseDown={(e)=>e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18}/></button><span className="otel-symbol large"><Plus size={22}/></span><p className="otel-kicker">New telemetry source</p><h2 id="quick-setup-title">What do you want to observe?</h2><p>Start with the system, then choose the collection path. A gateway is only suggested when the workload needs it.</p><div className="quick-source-list">{[['Application','SDK, auto-instrumentation or direct OTLP',Code2],['Kubernetes','Cluster, node, pod and workload telemetry',Boxes],['Host or VM','Host metrics, logs and process context',Server],['Something else','Browse databases, cloud, logs and integrations',Database]].map(([name,body,Icon])=><button key={String(name)} onClick={()=>{onClose();onNavigate('/opentelemetry/sources')}}><span><Icon size={19}/></span><p><strong>{name as string}</strong><small>{body as string}</small></p><ArrowRight size={16}/></button>)}</div></section></div>;
}
