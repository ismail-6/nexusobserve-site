import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Globe2,
  LayoutDashboard,
  Network,
  Puzzle,
  Rocket,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Workflow,
} from "lucide-react";
import { SiteLink } from "./lib/navigation";
import { nativePlugins } from "./nativePluginCatalog";
import {
  AgentSignalPreview,
  PluginCatalogPage,
} from "./components/CollectionPages";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    group: "Workspace",
  },
  {
    id: "setup",
    label: "Setup & enrollment",
    icon: Rocket,
    group: "Workspace",
  },
  { id: "plugins", label: "Plugin catalog", icon: Puzzle, group: "Workspace" },
  {
    id: "samplers",
    label: "Samplers",
    icon: SlidersHorizontal,
    group: "Workspace",
  },
  { id: "fleet", label: "Agent fleet", icon: Server, group: "Manage" },
  { id: "dataviews", label: "Dataviews", icon: Database, group: "Manage" },
  {
    id: "configuration",
    label: "Configuration",
    icon: Settings2,
    group: "Manage",
  },
  {
    id: "security",
    label: "Security & access",
    icon: ShieldCheck,
    group: "Operate",
  },
  {
    id: "rollouts",
    label: "Revisions & rollouts",
    icon: GitBranch,
    group: "Operate",
  },
  {
    id: "health",
    label: "Health & coverage",
    icon: Activity,
    group: "Operate",
  },
];

type Agent = {
  name: string;
  environment: string;
  site: string;
  revision: string;
  state: string;
  lastSeen: string;
  plugins: string[];
  buffer: string;
};
const agents: Agent[] = [
  {
    name: "production-vm-01",
    environment: "Production",
    site: "dc-1 / payments",
    revision: "rev-12",
    state: "Healthy",
    lastSeen: "12 sec",
    plugins: ["cpu", "disk", "network", "process", "systemd", "sql"],
    buffer: "0.8%",
  },
  {
    name: "production-vm-02",
    environment: "Production",
    site: "dc-1 / settlement",
    revision: "rev-12",
    state: "Healthy",
    lastSeen: "18 sec",
    plugins: ["cpu", "disk", "fkm", "ftm", "log-tailer"],
    buffer: "1.2%",
  },
  {
    name: "edge-prod-01",
    environment: "Production",
    site: "private network / edge",
    revision: "rev-11",
    state: "Attention",
    lastSeen: "3 min",
    plugins: ["cpu", "network", "x-ping", "x-http"],
    buffer: "58%",
  },
  {
    name: "staging-vm-01",
    environment: "Staging",
    site: "dc-2 / staging",
    revision: "rev-13",
    state: "Healthy",
    lastSeen: "9 sec",
    plugins: ["cpu", "process", "systemd"],
    buffer: "0.3%",
  },
  {
    name: "development-vm-01",
    environment: "Development",
    site: "local / development",
    revision: "Unverified",
    state: "Unverified",
    lastSeen: "No samples",
    plugins: ["cpu", "disk"],
    buffer: "—",
  },
];
const samplers = [
  {
    name: "Host CPU",
    plugin: "cpu",
    target: "production-vm-01",
    environment: "Production",
    interval: "30 sec",
    state: "Healthy",
  },
  {
    name: "Critical services",
    plugin: "systemd",
    target: "payment-worker",
    environment: "Production",
    interval: "30 sec",
    state: "Healthy",
  },
  {
    name: "Database connections",
    plugin: "sql",
    target: "orders-db.internal",
    environment: "Production",
    interval: "60 sec",
    state: "Healthy",
  },
  {
    name: "Private endpoint",
    plugin: "x-ping",
    target: "payment-gateway",
    environment: "Production",
    interval: "30 sec",
    state: "Attention",
  },
  {
    name: "Staging CPU",
    plugin: "cpu",
    target: "staging-vm-01",
    environment: "Staging",
    interval: "30 sec",
    state: "Healthy",
  },
  {
    name: "Development CPU",
    plugin: "cpu",
    target: "development-vm-01",
    environment: "Development",
    interval: "30 sec",
    state: "Unverified",
  },
];
type SamplerRecord = (typeof samplers)[number];

type WorkspaceProps = {
  path: string;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
};
export function AgentControlPlanePage({
  path,
  copied,
  onCopy,
}: WorkspaceProps) {
  const active =
    sections.find((section) => section.id === path.split("/")[2]) ||
    sections[0];
  const [environment, setEnvironment] = useState("Production");
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [path]);
  const visibleAgents = agents.filter(
    (agent) =>
      environment === "All environments" || agent.environment === environment,
  );
  const visibleSamplers = samplers.filter(
    (sampler) =>
      environment === "All environments" || sampler.environment === environment,
  );
  return (
    <div className="otel-app-shell agent-workspace">
      <aside className="otel-sidebar" aria-label="Agent workspace navigation">
        <div className="otel-sidebar-title">
          <span className="otel-symbol">
            <Cpu size={19} />
          </span>
          <div>
            <strong>Agent-based collection</strong>
            <span>Native collection workspace</span>
          </div>
        </div>
        {["Workspace", "Manage", "Operate"].map((group) => (
          <div className="otel-nav-group" key={group}>
            <span className="otel-nav-label">{group}</span>
            {sections
              .filter((section) => section.group === group)
              .map((section) => (
                <SiteLink
                  key={section.id}
                  href={"/agents/" + section.id}
                  className={
                    active.id === section.id
                      ? "otel-nav-item active"
                      : "otel-nav-item"
                  }
                  aria-current={active.id === section.id ? "page" : undefined}
                >
                  <section.icon size={16} />
                  <span>{section.label}</span>
                  {section.id === "plugins" && <em>{nativePlugins.length}</em>}
                </SiteLink>
              ))}
          </div>
        ))}
        <div className="otel-sidebar-help">
          <BookOpen size={17} />
          <div>
            <strong>Collection guides</strong>
            <span>Install, enroll, and configure.</span>
          </div>
          <SiteLink href="/docs/agent">
            Read agent setup
            <ArrowRight size={14} />
          </SiteLink>
          <SiteLink href="/docs/plugins">
            Read plugin setup
            <ArrowRight size={14} />
          </SiteLink>
        </div>
      </aside>
      <div className="otel-main">
        <header className="otel-workspace-header">
          <div>
            <p className="otel-breadcrumb">
              <SiteLink href="/product">Platform</SiteLink>
              <span>/</span>Agent-based<span>/</span>
              {active.label}
            </p>
            <h1>{active.label}</h1>
          </div>
          <div className="otel-header-actions">
            <label className="otel-environment-select">
              <Globe2 size={15} />
              <select
                aria-label="Environment"
                value={environment}
                onChange={(event) => setEnvironment(event.target.value)}
              >
                {[
                  "Production",
                  "Staging",
                  "Development",
                  "All environments",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Button asChild size="sm" className="otel-button primary">
              <SiteLink href="/agents/setup">
                <Rocket size={15} />
                Set up agent
              </SiteLink>
            </Button>
          </div>
        </header>
        <div
          className="otel-content agent-content"
          ref={contentRef}
          role="region"
          aria-label="Agent workspace content"
          tabIndex={0}
        >
          <div className="agent-demo-notice">
            <Badge variant="outline">Example workspace</Badge>
            <span>
              Explore native collection with illustrative inventory and signal
              data.
            </span>
          </div>
          {active.id === "overview" && (
            <AgentOverview
              agents={visibleAgents}
              samplerCount={visibleSamplers.length}
            />
          )}
          {active.id === "setup" && (
            <AgentSetup copied={copied} onCopy={onCopy} />
          )}
          {active.id === "plugins" && (
            <PluginCatalogPage embedded basePath="/agents/plugins" />
          )}
          {active.id === "samplers" && (
            <AgentSamplers
              samplers={visibleSamplers}
              copied={copied}
              onCopy={onCopy}
            />
          )}
          {active.id === "fleet" && <AgentFleet agents={visibleAgents} />}
          {active.id === "dataviews" && <AgentDataviews />}
          {active.id === "configuration" && (
            <AgentConfiguration copied={copied} onCopy={onCopy} />
          )}
          {active.id === "security" && (
            <AgentSecurity copied={copied} onCopy={onCopy} />
          )}
          {active.id === "rollouts" && <AgentRollouts agents={visibleAgents} />}
          {active.id === "health" && (
            <AgentHealth agents={visibleAgents} samplers={visibleSamplers} />
          )}
        </div>
      </div>
    </div>
  );
}

function Intro({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="otel-page-intro">
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      {children}
    </div>
  );
}
function Panel({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <Card className="otel-panel agent-panel">
      <div className="otel-panel-head">
        <div>
          {kicker && <span className="otel-kicker">{kicker}</span>}
          <h3>{title}</h3>
        </div>
      </div>
      {children}
    </Card>
  );
}
function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <Card asChild>
      <article className="otel-metric">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </article>
    </Card>
  );
}
function State({ value }: { value: string }) {
  return (
    <span
      className={
        "otel-state " +
        (value === "Healthy" || value === "In sync"
          ? "good"
          : value === "Attention" || value === "Drift"
            ? "warn"
            : "plain")
      }
    >
      {value}
    </span>
  );
}
function CodePanel({
  code,
  label,
  title,
  copied,
  onCopy,
  disabled = false,
}: {
  code: string;
  label: string;
  title: string;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="agent-code-panel">
      <div>
        <span>
          <FileCode2 size={15} />
          {title}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={() => onCopy(code, label)}
        >
          <Clipboard size={14} />
          {copied === label ? "Copied" : "Copy example"}
        </Button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      <span className="sr-only" role="status">
        {copied === label ? title + " copied." : ""}
      </span>
    </div>
  );
}
function Table({
  caption,
  columns,
  children,
}: {
  caption: string;
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div
      className="agent-workspace-table"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function AgentOverview({
  agents,
  samplerCount,
}: {
  agents: Agent[];
  samplerCount: number;
}) {
  const healthy = agents.filter((agent) => agent.state === "Healthy").length;
  return (
    <>
      <Intro
        title="Direct collection. Connected operations."
        body="Fetch host, process, file, database, and private network signals with the NexusObserve agent. Native plugins, open telemetry, and incident investigation belong to the same product."
      />
      <div className="otel-metric-grid">
        <Metric
          label="Agents in view"
          value={agents.length}
          note="Filtered by environment"
        />
        <Metric
          label="Healthy agents"
          value={healthy}
          note={healthy + " of " + agents.length + " in this example"}
        />
        <Metric
          label="Native plugin catalog"
          value={nativePlugins.length}
          note="Samplers and tailers for local collection"
        />
        <Metric
          label="Configured samplers"
          value={samplerCount}
          note="Example collection inventory"
        />
      </div>
      <div className="agent-workspace-grid three">
        {[
          {
            icon: Server,
            title: "Manage the native runtime",
            body: "Enroll hosts, inspect agent state, and understand which systems are reporting.",
            href: "/agents/fleet",
            link: "Explore agent fleet",
          },
          {
            icon: Puzzle,
            title: "Choose your collection plugins",
            body: "Find samplers for CPU, SQL, services, file arrivals, logs, and private endpoints.",
            href: "/agents/plugins",
            link: "Browse plugin catalog",
          },
          {
            icon: Workflow,
            title: "Build the operating view",
            body: "Turn local measurements into dataviews, dashboards, alert rules, and incident context.",
            href: "/agents/dataviews",
            link: "Explore dataviews",
          },
        ].map((item) => (
          <Panel title={item.title} key={item.href}>
            <item.icon size={23} />
            <p>{item.body}</p>
            <SiteLink href={item.href} className="text-link">
              {item.link}
              <ArrowRight size={15} />
            </SiteLink>
          </Panel>
        ))}
      </div>
      <AgentSignalPreview />
      <Panel
        title="From enrollment to investigation"
        kicker="COLLECTION LIFECYCLE"
      >
        <div className="agent-lifecycle">
          {[
            "Enroll agent",
            "Configure plugins",
            "Fetch samples",
            "Build dataviews",
            "Alert & investigate",
          ].map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function AgentSetup({
  copied,
  onCopy,
}: Pick<WorkspaceProps, "copied" | "onCopy">) {
  const [deployment, setDeployment] = useState("Linux host");
  const [server, setServer] = useState("https://observe.example.com");
  let origin = "";
  try {
    const url = new URL(server);
    if (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    )
      origin = url.origin;
  } catch {
    /* Form validation explains incomplete input. */
  }
  const quotedOrigin = JSON.stringify(origin || "https://observe.example.com");
  const examples: Record<string, string> = {
    "Linux host":
      "curl -fsSL " +
      window.location.origin +
      "/downloads/nexusobserve-agent-linux-amd64.tar.gz -o nexusobserve-agent-linux-amd64.tar.gz\ntar -xzf nexusobserve-agent-linux-amd64.tar.gz\nchmod +x nexusobserve-agent-linux-amd64\n./nexusobserve-agent-linux-amd64 enroll \\\n  --server " +
      quotedOrigin +
      " \\\n  --token '<one-time-enrollment-token>'",
    Docker:
      "environment:\n  NEXUSOBSERVE_SERVER_URL: " +
      quotedOrigin +
      '\n  NEXUSOBSERVE_AGENT_TRANSPORT_ADDR: "<agent-transport-host>:9090"\n  NEXUSOBSERVE_BOOTSTRAP_TOKEN: "<one-time-enrollment-token>"\n  NEXUSOBSERVE_COLLECTION_HOST_MODE: native\n  NEXUSOBSERVE_COLLECTION_PROCESS_MODE: native\n  NEXUSOBSERVE_COLLECTION_CONTAINER_MODE: native',
    Kubernetes:
      "server:\n  url: " +
      quotedOrigin +
      '\n  transportAddr: "<agent-transport-host>:9090"\nenrollment:\n  existingSecret: nexusobserve-agent-bootstrap\nagent:\n  flushIntervalSec: 10\n  bufferMaxPoints: 50000\ncollection:\n  hostMode: native\n  processMode: native\n  containerMode: auto\n  kubernetesMode: native',
  };
  return (
    <>
      <Intro
        title="Install, enroll, and start fetching signals."
        body="Choose the runtime location, create a short-lived enrollment token in your console, and enable the plugins that fit that host class."
      />
      <div className="agent-workspace-grid three">
        {[
          ["Linux host", "Hosts, VMs, private networks, and edge systems."],
          ["Docker", "Local container visibility alongside host collection."],
          [
            "Kubernetes",
            "Node and workload collection with a cluster deployment.",
          ],
        ].map(([title, body]) => (
          <Button
            variant="outline"
            className="agent-deployment-option"
            key={title}
            aria-pressed={deployment === title}
            onClick={() => setDeployment(title)}
          >
            <Server size={21} />
            <strong>{title}</strong>
            <span>{body}</span>
          </Button>
        ))}
      </div>
      <div className="agent-workspace-grid">
        <Panel title="Connect to your NexusObserve server">
          <label className="agent-field">
            Server URL
            <input
              type="url"
              value={server}
              onChange={(event) => setServer(event.target.value)}
              aria-invalid={!origin}
              aria-describedby="agent-server-help"
            />
          </label>
          <p id="agent-server-help">
            {origin
              ? "Use the server URL from your deployment. Replace token and transport placeholders before use."
              : "Enter an HTTP or HTTPS server URL without credentials."}
          </p>
          <ol className="agent-step-list">
            {[
              "Download and verify the agent package.",
              "Create a short-lived enrollment token.",
              "Enroll against the server and configure transport trust.",
              "Enable plugins and verify samples in the console.",
            ].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <SiteLink href="/docs/agent" className="text-link">
            Complete agent setup guide
            <ArrowRight size={15} />
          </SiteLink>
        </Panel>
        <Panel
          title={
            deployment === "Linux host"
              ? "Enrollment command"
              : deployment === "Docker"
                ? "Container environment"
                : "Helm values excerpt"
          }
        >
          <CodePanel
            code={examples[deployment]}
            label="agent-enrollment"
            title={deployment + " setup example"}
            copied={copied}
            onCopy={onCopy}
            disabled={!origin}
          />
          <p>
            {deployment === "Linux host"
              ? "The command uses the native agent archive served by this site."
              : "Apply these settings to your agent deployment with the package instructions and scoped runtime access."}
          </p>
        </Panel>
      </div>
    </>
  );
}

function AgentSamplers({
  samplers,
  copied,
  onCopy,
}: { samplers: SamplerRecord[] } & Pick<WorkspaceProps, "copied" | "onCopy">) {
  const [plugin, setPlugin] = useState("cpu");
  const [interval, setInterval] = useState("30");
  const valid =
    Number.isInteger(Number(interval)) &&
    Number(interval) >= 5 &&
    Number(interval) <= 3600;
  const configs: Record<string, Record<string, unknown>> = {
    cpu: {},
    systemd: { services: ["payment-worker.service"] },
    sql: {
      execution_target: "probe",
      db_type: "postgres",
      db_host: "orders-db.internal",
      db_name: "orders",
      query: "SELECT count(*) AS active_connections FROM pg_stat_activity",
      timeout_sec: 10,
    },
  };
  const code = JSON.stringify(
    {
      plugin,
      config: {
        interval_sec: valid ? Number(interval) : 30,
        ...configs[plugin],
      },
    },
    null,
    2,
  );
  return (
    <>
      <Intro
        title="Fetch the measurements your operations depend on."
        body="Configure native sampler intervals and source settings. Use bounded SQL queries, selected service units, and host counters to build useful monitoring coverage."
      />
      <div className="agent-workspace-grid">
        <Panel title="Preview a sampler configuration">
          <label className="agent-field">
            Native plugin
            <select
              value={plugin}
              onChange={(event) => setPlugin(event.target.value)}
            >
              <option value="cpu">CPU</option>
              <option value="systemd">Systemd services</option>
              <option value="sql">SQL query sampler</option>
            </select>
          </label>
          <label className="agent-field">
            Collection interval (seconds)
            <input
              type="number"
              min={5}
              max={3600}
              step={1}
              value={interval}
              onChange={(event) => setInterval(event.target.value)}
              aria-invalid={!valid}
              aria-describedby="agent-sampler-help"
            />
          </label>
          <p id="agent-sampler-help">
            {valid
              ? "This preview changes the example only. Configure production samplers in your NexusObserve console."
              : "Choose a whole number between 5 and 3600 seconds."}
          </p>
          <SiteLink href="/agents/plugins" className="text-link">
            See all native plugin controls
            <ArrowRight size={15} />
          </SiteLink>
        </Panel>
        <Panel title="Sampler configuration example">
          <CodePanel
            code={code}
            label="agent-sampler"
            title="Native sampler JSON"
            copied={copied}
            onCopy={onCopy}
            disabled={!valid}
          />
        </Panel>
      </div>
      <Panel title="Configured samplers" kicker="EXAMPLE INVENTORY">
        <Table
          caption="Example configured samplers"
          columns={["Sampler", "Plugin", "Target", "Interval", "State"]}
        >
          {samplers.map((sampler) => (
            <tr key={sampler.name}>
              <th scope="row">{sampler.name}</th>
              <td>
                <code>{sampler.plugin}</code>
              </td>
              <td>{sampler.target}</td>
              <td>{sampler.interval}</td>
              <td>
                <State value={sampler.state} />
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}

function AgentFleet({ agents }: { agents: Agent[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Agent | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const filtered = agents.filter((agent) =>
    [agent.name, agent.site, ...agent.plugins]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <Intro
        title="Every agent, with its collection context."
        body="Inspect enrolled hosts, enabled plugins, configuration revisions, reporting state, and buffered telemetry. Filter this example by environment or search for a host, site, or plugin."
      />
      <Panel title="Agent inventory">
        <label className="plugin-search">
          <Search size={16} />
          <span className="sr-only">Search example agents</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search agents, sites, or plugins…"
          />
        </label>
        <p role="status">
          {filtered.length} {filtered.length === 1 ? "agent" : "agents"} in view
        </p>
        <Table
          caption="Example agent inventory"
          columns={[
            "Agent",
            "Site",
            "Plugins",
            "Revision",
            "State",
            "Last seen",
            "Details",
          ]}
        >
          {filtered.map((agent) => (
            <tr key={agent.name}>
              <th scope="row">{agent.name}</th>
              <td>{agent.site}</td>
              <td>{agent.plugins.length}</td>
              <td>{agent.revision}</td>
              <td>
                <State value={agent.state} />
              </td>
              <td>{agent.lastSeen}</td>
              <td>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={"Inspect " + agent.name}
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setSelected(agent);
                  }}
                >
                  Inspect
                  <ArrowRight size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <p>No matching agents. Try another host, site, or plugin.</p>
        )}
      </Panel>
      <div className="agent-workspace-grid">
        <Panel title="Identity and enrollment" kicker="TRUST THE RUNTIME">
          <p>
            Use short-lived bootstrap tokens to enroll agents against your
            server. Plan transport trust, certificate storage, and the runtime
            identity for each host class.
          </p>
          <SiteLink href="/agents/setup" className="text-link">
            Setup & enrollment
            <ArrowRight size={15} />
          </SiteLink>
        </Panel>
        <Panel
          title="Desired and observed configuration"
          kicker="UNDERSTAND DRIFT"
        >
          <p>
            Compare the revision you intend to run with the configuration
            observed on the host. Check reporting health before broadening the
            rollout.
          </p>
          <SiteLink href="/agents/rollouts" className="text-link">
            Explore revisions & rollouts
            <ArrowRight size={15} />
          </SiteLink>
        </Panel>
      </div>
      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent
          className="plugin-detail-sheet agent-detail-sheet"
          onCloseAutoFocus={(event) => {
            if (triggerRef.current?.isConnected) {
              event.preventDefault();
              triggerRef.current.focus();
            }
          }}
        >
          <SheetHeader>
            <SheetTitle>{selected?.name || "Agent details"}</SheetTitle>
            <SheetDescription>
              Illustrative agent inventory and collection state.
            </SheetDescription>
          </SheetHeader>
          {selected && (
            <>
              <div className="agent-detail-properties">
                <span>
                  Environment<strong>{selected.environment}</strong>
                </span>
                <span>
                  Site<strong>{selected.site}</strong>
                </span>
                <span>
                  Revision<strong>{selected.revision}</strong>
                </span>
                <span>
                  Reporting state<strong>{selected.state}</strong>
                </span>
                <span>
                  Last seen<strong>{selected.lastSeen}</strong>
                </span>
                <span>
                  Buffer utilization<strong>{selected.buffer}</strong>
                </span>
              </div>
              <section>
                <h3>Enabled collection plugins</h3>
                <div className="plugin-config-fields">
                  {selected.plugins.map((plugin) => (
                    <code key={plugin}>{plugin}</code>
                  ))}
                </div>
              </section>
              <SiteLink href="/agents/configuration" className="text-link">
                View runtime configuration
                <ArrowRight size={15} />
              </SiteLink>
              <SiteLink href="/agents/security" className="text-link">
                Review security & access
                <ArrowRight size={15} />
              </SiteLink>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function AgentDataviews() {
  return (
    <>
      <Intro
        title="Local measurements, with operational meaning."
        body="Explore collected signals as rows, headlines, and state. Connect the source to its service, owner, rules, and incident evidence instead of leaving it as an isolated check."
      />
      <AgentSignalPreview />
      <Panel
        title="The native operations model"
        kicker="FROM A HOST TO AN INVESTIGATION"
      >
        <div className="agent-definition-list">
          {[
            [
              "Gateway",
              "Organizes collection and operational configuration for an estate.",
            ],
            [
              "Probe",
              "Represents the host or runtime where native collection takes place.",
            ],
            [
              "Sampler",
              "Fetches a configured signal using a plugin, interval, and target.",
            ],
            [
              "Dataview",
              "Gives measurements row identities, headlines, and operational state.",
            ],
            [
              "Rule & incident",
              "Turns conditions into alerts, ownership, and a shared investigation timeline.",
            ],
            [
              "Command",
              "Connects approved operational actions to bounded execution and audit.",
            ],
          ].map(([name, description]) => (
            <div key={name}>
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="agent-workspace-grid">
        <Panel title="Use native plugins across the product">
          <p>
            Host state, SQL results, file conditions, and endpoint checks feed
            the same dashboards, alerts, and investigations as other signals.
          </p>
          <SiteLink href="/agents/plugins" className="text-link">
            Browse native collection plugins
            <ArrowRight size={15} />
          </SiteLink>
        </Panel>
        <Panel title="Connect a hybrid estate">
          <p>
            Combine direct agent collection with SDK and Collector telemetry
            using shared service and environment context.
          </p>
          <SiteLink href="/opentelemetry" className="text-link">
            Explore OpenTelemetry
            <ArrowRight size={15} />
          </SiteLink>
        </Panel>
      </div>
    </>
  );
}

function AgentConfiguration({
  copied,
  onCopy,
}: Pick<WorkspaceProps, "copied" | "onCopy">) {
  const [model, setModel] = useState("agent");
  const [flush, setFlush] = useState("10");
  const [buffer, setBuffer] = useState("50000");
  const valid =
    Number.isInteger(Number(flush)) &&
    Number(flush) >= 1 &&
    Number(flush) <= 300 &&
    Number.isInteger(Number(buffer)) &&
    Number(buffer) >= 1000 &&
    Number(buffer) <= 1000000;
  const hybrid = model === "hybrid";
  const code =
    "NEXUSOBSERVE_SERVER_URL=https://observe.example.com\nNEXUSOBSERVE_AGENT_TRANSPORT_ADDR=<agent-transport-host>:9090\nNEXUSOBSERVE_COLLECTION_HOST_MODE=native\nNEXUSOBSERVE_COLLECTION_PROCESS_MODE=native\nNEXUSOBSERVE_COLLECTION_CONTAINER_MODE=auto\nNEXUSOBSERVE_COLLECTION_APP_TRACES_MODE=" +
    (hybrid ? "otlp" : "off") +
    "\nNEXUSOBSERVE_COLLECTION_APP_LOGS_MODE=" +
    (hybrid ? "hybrid" : "off") +
    "\nNEXUSOBSERVE_COLLECTION_APP_METRICS_MODE=" +
    (hybrid ? "hybrid" : "off") +
    "\nNEXUSOBSERVE_OTLP_ENABLED=" +
    (hybrid ? "true" : "false") +
    "\nNEXUSOBSERVE_AGENT_FLUSH_INTERVAL_SEC=" +
    (valid ? flush : "10") +
    "\nNEXUSOBSERVE_AGENT_BUFFER_MAX_POINTS=" +
    (valid ? buffer : "50000") +
    "\nNEXUSOBSERVE_AGENT_BUFFER_FILE=/var/lib/nexusobserve-agent/spool/telemetry.json";
  return (
    <>
      <Intro
        title="Shape collection around your environment."
        body="Choose a direct agent runtime or a hybrid setup, then configure transport, collection modes, flush behavior, and local buffering. Preview the documented environment settings below."
      />
      <div className="agent-workspace-grid">
        <Panel title="Runtime profile">
          <label className="agent-field">
            Collection model
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
            >
              <option value="agent">Agent-based collection</option>
              <option value="hybrid">Hybrid: native collection + OTLP</option>
            </select>
          </label>
          <label className="agent-field">
            Flush interval (seconds)
            <input
              type="number"
              min={1}
              max={300}
              value={flush}
              onChange={(event) => setFlush(event.target.value)}
              aria-invalid={!valid}
            />
          </label>
          <label className="agent-field">
            Maximum buffered points
            <input
              type="number"
              min={1000}
              max={1000000}
              step={1000}
              value={buffer}
              onChange={(event) => setBuffer(event.target.value)}
              aria-invalid={!valid}
            />
          </label>
          <p>
            {valid
              ? "Settings update this example. Use your deployment's host access, transport trust, and retention requirements before applying configuration."
              : "Use whole numbers: 1–300 seconds for flushing and 1,000–1,000,000 buffered points."}
          </p>
        </Panel>
        <Panel title="Agent environment example">
          <CodePanel
            code={code}
            label="agent-runtime"
            title="Runtime environment"
            copied={copied}
            onCopy={onCopy}
            disabled={!valid}
          />
        </Panel>
      </div>
      <div className="agent-workspace-grid three">
        {[
          [
            "Collection modes",
            "Native host and process collection can operate independently. A hybrid profile also accepts application telemetry through OTLP.",
          ],
          [
            "Flush and buffering",
            "Batch samples for transport and retain a bounded local spool during connection interruptions. Watch buffer pressure and export failures.",
          ],
          [
            "Scoped configuration",
            "Define plugin, path, egress, and executable policy for the host class. Inspect observed revisions after configuration changes.",
          ],
        ].map(([title, body]) => (
          <Panel title={title} key={title}>
            <p>{body}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}

function AgentSecurity({
  copied,
  onCopy,
}: Pick<WorkspaceProps, "copied" | "onCopy">) {
  const [profile, setProfile] = useState("restricted");
  const restricted = profile === "restricted";
  const code =
    "agent_policy:\n  class: " +
    (restricted ? "production-restricted" : "standard-host") +
    "\n  plugins_allowed: [cpu, disk, network, process, systemd, sql, fkm, ftm]\n  plugins_denied: " +
    (restricted ? "[toolkit, external_plugin]" : "[external_plugin]") +
    "\n  read_paths_allowed:\n    - /var/log/\n    - /opt/app/logs/\n  egress_allowed:\n    - host: orders-db.internal\n      port: 5432\n  commands_allowed: []";
  return (
    <>
      <Intro
        title="Keep local collection within a clear policy."
        body="The agent runs close to production systems. Define the trust profile, plugin access, approved paths, network destinations, and command boundaries for each host class."
      />
      <div className="agent-workspace-grid">
        <Panel title="Choose an example access profile">
          <label className="agent-field">
            Policy profile
            <select
              value={profile}
              onChange={(event) => setProfile(event.target.value)}
            >
              <option value="restricted">Restricted production</option>
              <option value="standard">Standard host</option>
            </select>
          </label>
          <div className="agent-definition-list">
            {[
              [
                "Enrollment & identity",
                "Use short-lived tokens and a trusted certificate chain for agent transport.",
              ],
              [
                "Configuration signing",
                restricted
                  ? "Require trusted signing and verification for a restricted production deployment."
                  : "Choose a signing policy for your deployment. Simple startup profiles may keep signing optional.",
              ],
              [
                "Plugins & local access",
                restricted
                  ? "Allow selected plugins and explicit file or network targets. Keep Toolkit and external plugins denied."
                  : "Enable only the plugins and targets needed for this host class.",
              ],
              [
                "Commands & audit",
                "Configure approved executable paths, bounded runtime, redacted output, and actor audit before enabling commands.",
              ],
            ].map(([title, body]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Access policy example">
          <CodePanel
            code={code}
            label="agent-policy"
            title="Agent policy YAML"
            copied={copied}
            onCopy={onCopy}
          />
          <p>
            The deployment profile determines certificate, signing,
            secret-provider, and audit requirements. This excerpt illustrates
            plugin and access policy.
          </p>
        </Panel>
      </div>
      <Panel title="Credentials stay scoped to the collection target">
        <p>
          Use secret references and least-privilege database or endpoint
          credentials. Grant file monitors only their required read roots, and
          review network or script permissions before rollout.
        </p>
        <SiteLink href="/docs/agent" className="text-link">
          Read the agent deployment guide
          <ArrowRight size={15} />
        </SiteLink>
      </Panel>
    </>
  );
}

function AgentRollouts({ agents }: { agents: Agent[] }) {
  return (
    <>
      <Intro
        title="Know what you intended, and what is running."
        body="Inspect desired and observed configuration before expanding a rollout. Use a small host group, review collection health, and retain the previous approved revision."
      />
      <Panel title="Configuration revisions" kicker="EXAMPLE RECONCILIATION">
        <Table
          caption="Example agent configuration revisions"
          columns={[
            "Agent",
            "Desired",
            "Observed",
            "Collection",
            "Revision state",
          ]}
        >
          {agents.map((agent) => {
            const desired =
              agent.environment === "Staging" ? "rev-13" : "rev-12";
            return (
              <tr key={agent.name}>
                <th scope="row">{agent.name}</th>
                <td>{desired}</td>
                <td>{agent.revision}</td>
                <td>
                  <State value={agent.state} />
                </td>
                <td>
                  <State
                    value={
                      agent.revision === "Unverified"
                        ? "Unverified"
                        : agent.revision === desired
                          ? "In sync"
                          : "Drift"
                    }
                  />
                </td>
              </tr>
            );
          })}
        </Table>
      </Panel>
      <div className="agent-workspace-grid">
        {[
          [
            "Review the change",
            "Compare plugin settings, intervals, read paths, network targets, and access policy against the previous revision.",
          ],
          [
            "Start with a small scope",
            "Apply the approved configuration to a selected host class or canary group in your deployment.",
          ],
          [
            "Verify the observed result",
            "Confirm the new revision is observed, samples arrive, and buffers, timeouts, and permissions remain healthy.",
          ],
          [
            "Expand or restore",
            "Broaden the approved configuration when collection is healthy. Restore the previous revision if checks fail.",
          ],
        ].map(([title, body], index) => (
          <Panel title={title} kicker={"STEP " + (index + 1)} key={title}>
            <p>{body}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}

function AgentHealth({
  agents,
  samplers,
}: {
  agents: Agent[];
  samplers: SamplerRecord[];
}) {
  const healthyAgents = agents.filter(
    (agent) => agent.state === "Healthy",
  ).length;
  const healthySamplers = samplers.filter(
    (sampler) => sampler.state === "Healthy",
  ).length;
  return (
    <>
      <Intro
        title="See collection health and the gaps behind it."
        body="Check agent reporting, sampler readiness, transport interruptions, local buffers, and missing access. Use the same environment scope as the inventory."
      />
      <div className="otel-metric-grid">
        <Metric
          label="Healthy agents"
          value={healthyAgents + "/" + agents.length}
          note="Example reporting state"
        />
        <Metric
          label="Healthy samplers"
          value={healthySamplers + "/" + samplers.length}
          note="Example configured checks"
        />
        <Metric
          label="Agents to review"
          value={agents.length - healthyAgents}
          note="Attention or unverified collection"
        />
        <Metric
          label="Native coverage options"
          value={nativePlugins.length}
          note="Explore plugins for missing signals"
        />
      </div>
      <Panel title="Reporting and local buffers">
        <Table
          caption="Example agent health and buffers"
          columns={["Agent", "Reporting", "Last seen", "Buffer used", "Review"]}
        >
          {agents.map((agent) => (
            <tr key={agent.name}>
              <th scope="row">{agent.name}</th>
              <td>
                <State value={agent.state} />
              </td>
              <td>{agent.lastSeen}</td>
              <td>{agent.buffer}</td>
              <td>
                {agent.state === "Attention"
                  ? "Transport, backlog, and endpoint checks"
                  : agent.state === "Unverified"
                    ? "Enrollment and first samples"
                    : "Collection is reporting"}
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
      <div className="agent-workspace-grid three">
        {[
          [
            "Transport and buffering",
            "Inspect export failures, connection trust, retry behavior, and spool pressure when reporting slows.",
          ],
          [
            "Plugin readiness",
            "Check enabled plugins, source permissions, timeouts, and configured paths when a sampler has no useful samples.",
          ],
          [
            "Coverage and ownership",
            "Compare critical systems with enabled samplers and rules. Bring missing signals into a service and owner context.",
          ],
        ].map(([title, body]) => (
          <Panel title={title} key={title}>
            <p>{body}</p>
            <SiteLink href="/agents/plugins" className="text-link">
              Explore collection coverage
              <ArrowRight size={15} />
            </SiteLink>
          </Panel>
        ))}
      </div>
    </>
  );
}
