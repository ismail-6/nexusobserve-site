import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Network,
  Puzzle,
  Search,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { SiteLink } from "@/lib/navigation";
import { nativePlugins, pluginCategories } from "@/nativePluginCatalog";
import { ClosingCta } from "./MarketingHome";

const categoryIcons = {
  Infrastructure: Cpu,
  "Processes & services": Server,
  "Files & logs": FileText,
  Databases: Database,
  "Network & endpoints": Network,
  "Custom operations": Workflow,
};

function CollectionNavigation({ active }: { active: string }) {
  return (
    <nav
      className="collection-page-nav section-frame"
      aria-label="Platform collection paths"
    >
      <SiteLink href="/product">Platform overview</SiteLink>
      {[
        ["/agents", "Agent-based collection"],
        ["/plugins", "Plugin catalog"],
        ["/opentelemetry", "OpenTelemetry"],
      ].map(([href, label]) => (
        <SiteLink
          key={href}
          href={href}
          aria-current={href === active ? "page" : undefined}
        >
          {label}
        </SiteLink>
      ))}
    </nav>
  );
}

const sampleViews = [
  {
    id: "host",
    name: "Hosts & processes",
    icon: Cpu,
    title: "Local system health",
    body: "Read host counters, process state, and service health directly where the workload runs.",
    category: "Processes & services",
    rows: [
      ["CPU", "cpu", "Utilization", "24.8%", "Normal"],
      ["Memory", "hardware", "Used memory", "6.2 GB", "Normal"],
      ["checkout-api", "process", "Process count", "3", "Normal"],
      ["payment-worker", "systemd", "Unit state", "active", "Normal"],
    ],
  },
  {
    id: "files",
    name: "Files & logs",
    icon: FileText,
    title: "Files with operational meaning",
    body: "Track important log patterns and expected file arrivals, with the same ownership and alert context.",
    category: "Files & logs",
    rows: [
      [
        "Application log",
        "log-tailer",
        "Latest records",
        "128 lines",
        "Normal",
      ],
      ["Payment failures", "fkm", "Matched errors", "2", "Attention"],
      ["Settlement file", "ftm", "Arrival window", "Received", "Normal"],
      ["Reconciliation file", "ftm", "File freshness", "4 min", "Normal"],
    ],
  },
  {
    id: "database",
    name: "Databases",
    icon: Database,
    title: "Fetch the checks your database team needs",
    body: "Run bounded, read-only SQL samplers and turn result columns into shared operational metrics.",
    category: "Databases",
    rows: [
      ["orders-db", "sql", "Active connections", "42", "Normal"],
      ["orders-db", "sql", "Blocked sessions", "0", "Normal"],
      ["settlement-db", "sql", "Pending batches", "7", "Attention"],
      ["reporting-db", "sql", "Query duration", "18 ms", "Normal"],
    ],
  },
  {
    id: "network",
    name: "Private endpoints",
    icon: Network,
    title: "Visibility from inside your network",
    body: "Measure reachability, HTTP timings, and interface behavior from the location that serves your systems.",
    category: "Network & endpoints",
    rows: [
      ["payment-gateway", "x-ping", "Round-trip time", "2.4 ms", "Normal"],
      ["internal-api", "x-http", "Response time", "86 ms", "Normal"],
      ["eth0", "network", "Receive rate", "18.2 MB/s", "Normal"],
      ["customer-portal", "website-monitor", "HTTP status", "200", "Normal"],
    ],
  },
];

export function AgentSignalPreview({
  catalogPath = "/agents/plugins",
}: {
  catalogPath?: string;
}) {
  return (
    <section
      className="agent-collection-preview"
      aria-label="Agent collection preview"
    >
      <Tabs defaultValue="host">
        <div className="agent-preview-topbar">
          <span>
            <Cpu size={18} /> NexusObserve agent
          </span>
          <Badge variant="outline">Illustrative data</Badge>
        </div>
        <TabsList
          className="agent-preview-tabs"
          aria-label="Explore agent-collected signals"
        >
          {sampleViews.map((view) => (
            <TabsTrigger key={view.id} value={view.id}>
              <view.icon size={16} />
              {view.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {sampleViews.map((view) => (
          <TabsContent
            key={view.id}
            value={view.id}
            className="agent-preview-content"
          >
            <div className="agent-preview-heading">
              <div>
                <p className="eyebrow">PRODUCTION-VM-01 · EXAMPLE DATAVIEW</p>
                <h2>{view.title}</h2>
                <p>{view.body}</p>
              </div>
              <span className="agent-collection-label">
                <ShieldCheck size={16} /> Direct collection
              </span>
            </div>
            <div
              className="agent-data-table"
              role="region"
              aria-label="Example agent dataview"
              tabIndex={0}
            >
              <table>
                <caption className="sr-only">
                  Example agent-collected {view.name.toLowerCase()} signals
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Source</th>
                    <th scope="col">Plugin</th>
                    <th scope="col">Measurement</th>
                    <th scope="col">Value</th>
                    <th scope="col">State</th>
                  </tr>
                </thead>
                <tbody>
                  {view.rows.map(
                    ([source, plugin, measurement, value, state]) => (
                      <tr key={source + measurement}>
                        <th scope="row">{source}</th>
                        <td>
                          <code>{plugin}</code>
                        </td>
                        <td>{measurement}</td>
                        <td>
                          <strong>{value}</strong>
                        </td>
                        <td>
                          <span
                            className={
                              state === "Attention"
                                ? "agent-state attention"
                                : "agent-state"
                            }
                          >
                            <i />
                            {state}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <div className="agent-preview-footer">
              <span>
                Agent → Native sampler → Shared dataview → Alerts &
                investigation
              </span>
              <SiteLink
                href={
                  catalogPath + "?category=" + encodeURIComponent(view.category)
                }
                className="text-link"
              >
                Explore these plugins
                <ArrowRight size={15} />
              </SiteLink>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export function PluginCatalogPage({
  embedded = false,
  basePath = "/plugins",
}: {
  embedded?: boolean;
  basePath?: string;
}) {
  const detailsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [search, setSearch] = useState(() => window.location.search);
  useEffect(() => {
    const update = () => setSearch(window.location.search);
    window.addEventListener("popstate", update);
    window.addEventListener("site:navigate", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("site:navigate", update);
    };
  }, []);
  const params = new URLSearchParams(search);
  const query = params.get("q") || "";
  const categoryParam = params.get("category") || "All plugins";
  const category = pluginCategories.includes(categoryParam)
    ? categoryParam
    : "All plugins";
  const selected = nativePlugins.find(
    (plugin) => plugin.id === params.get("plugin"),
  );
  const filtered = nativePlugins.filter(
    (plugin) =>
      (category === "All plugins" || plugin.category === category) &&
      [plugin.id, plugin.name, plugin.description, plugin.category]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    const nextSearch = next.toString();
    window.history.replaceState(
      {},
      "",
      basePath + (nextSearch ? "?" + nextSearch : ""),
    );
    setSearch(window.location.search);
  }
  return (
    <div className="collection-detail-page plugin-catalog-page">
      {!embedded && (
        <>
          <CollectionNavigation active="/plugins" />
          <section className="product-marketing-hero section-frame">
            <Badge variant="outline">
              <Puzzle size={13} /> NATIVE PLUGIN CATALOG
            </Badge>
            <h1>
              The right sampler.
              <br />
              <span className="gradient-text">For every critical system.</span>
            </h1>
            <p>
              Explore {nativePlugins.length} native collection plugins for
              infrastructure, services, files, databases, and private endpoints.
              Extend the NexusObserve agent with the operational signals your
              teams need.
            </p>
            <div className="hero-actions">
              <Button asChild size="lg" className="main-cta">
                <SiteLink href="/agents">
                  Explore agent collection
                  <ArrowRight size={16} />
                </SiteLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="outline-cta"
              >
                <SiteLink href="/docs/plugins">
                  Plugin setup guide
                  <ArrowRight size={16} />
                </SiteLink>
              </Button>
            </div>
          </section>
        </>
      )}
      <section
        className={
          embedded
            ? "native-plugin-catalog"
            : "native-plugin-catalog section-frame"
        }
        aria-label="Native plugins"
      >
        <div className="plugin-catalog-toolbar">
          <div>
            <p className="eyebrow">BUILT FOR DIRECT COLLECTION</p>
            <h2>Browse native plugins</h2>
          </div>
          <label className="plugin-search">
            <Search size={18} />
            <span className="sr-only">Search native plugins</span>
            <input
              type="search"
              placeholder="Search plugins, systems, or checks…"
              value={query}
              onChange={(event) => updateParam("q", event.target.value)}
            />
          </label>
        </div>
        <div
          className="plugin-category-filters"
          role="group"
          aria-label="Plugin categories"
        >
          {["All plugins", ...pluginCategories].map((item) => (
            <Button
              key={item}
              variant="outline"
              aria-pressed={category === item}
              onClick={() =>
                updateParam("category", item === "All plugins" ? "" : item)
              }
            >
              {item}
            </Button>
          ))}
        </div>
        <p className="plugin-result-count" role="status">
          {filtered.length} {filtered.length === 1 ? "plugin" : "plugins"}
          {category !== "All plugins"
            ? " in " + category
            : " for native agent collection"}
        </p>
        <div className="native-plugin-grid">
          {filtered.map((plugin) => {
            const Icon =
              categoryIcons[plugin.category as keyof typeof categoryIcons] ||
              Puzzle;
            return (
              <Card asChild key={plugin.id}>
                <article className="native-plugin-card">
                  <div className="plugin-card-top">
                    <span className="feature-icon">
                      <Icon size={21} />
                    </span>
                    <Badge variant="outline">
                      {plugin.signals.join(" + ")}
                    </Badge>
                  </div>
                  <p className="eyebrow">{plugin.category}</p>
                  <h3>{plugin.name}</h3>
                  <p>{plugin.description}</p>
                  <div className="plugin-card-footer">
                    <code>{plugin.id}</code>
                    <Button
                      variant="ghost"
                      onClick={(event) => {
                        detailsTriggerRef.current = event.currentTarget;
                        updateParam("plugin", plugin.id);
                      }}
                      aria-label={"Explore " + plugin.name}
                    >
                      Explore plugin
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                </article>
              </Card>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <Card className="plugin-empty-state">
            <Search size={27} />
            <h3>No matching plugins</h3>
            <p>
              Try another system name or clear your filters to see all native
              samplers.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                window.history.replaceState({}, "", basePath);
                setSearch("");
              }}
            >
              Clear filters
            </Button>
          </Card>
        )}
        <div className="plugin-otel-link">
          <div>
            <h3>Connecting SDKs or an OpenTelemetry Collector?</h3>
            <p>
              Browse the separate OpenTelemetry source catalog for application
              instrumentation and receiver templates.
            </p>
          </div>
          <SiteLink href="/opentelemetry/sources" className="text-link">
            OpenTelemetry sources
            <ArrowRight size={16} />
          </SiteLink>
        </div>
      </section>
      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) updateParam("plugin", "");
        }}
      >
        <SheetContent
          className={
            embedded
              ? "plugin-detail-sheet agent-detail-sheet"
              : "plugin-detail-sheet"
          }
          onCloseAutoFocus={(event) => {
            if (detailsTriggerRef.current?.isConnected) {
              event.preventDefault();
              detailsTriggerRef.current.focus();
            }
          }}
        >
          <SheetHeader>
            <Badge variant="outline">Native collection plugin</Badge>
            <SheetTitle>{selected?.name}</SheetTitle>
            <SheetDescription>{selected?.description}</SheetDescription>
          </SheetHeader>
          {selected && (
            <>
              <div className="plugin-detail-facts">
                <span>
                  <Puzzle size={16} />
                  {selected.id}
                </span>
                <span>{selected.category}</span>
                <span>{selected.signals.join(" · ")}</span>
              </div>
              <section>
                <h3>Collection access</h3>
                <p>{selected.access}</p>
              </section>
              {selected.metrics.length > 0 && (
                <section>
                  <h3>Collected measurements</h3>
                  <ul>
                    {selected.metrics.map((metric) => (
                      <li key={metric}>
                        <CheckCircle2 size={15} />
                        <code>{metric}</code>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {selected.fields.length > 0 && (
                <section>
                  <h3>Configuration controls</h3>
                  <div className="plugin-config-fields">
                    {selected.fields.map((field) => (
                      <code key={field}>{field}</code>
                    ))}
                  </div>
                  <p>
                    Configure these fields for your sampler in the NexusObserve
                    console.
                  </p>
                </section>
              )}
              <section>
                <h3>Use it across the product</h3>
                <p>
                  Connect collected signals to dataviews, dashboards, alert
                  rules, service context, and incident investigation.
                </p>
              </section>
              <Button asChild className="main-cta">
                <SiteLink href="/docs/plugins">
                  Read plugin setup
                  <ArrowRight size={16} />
                </SiteLink>
              </Button>
              <SiteLink href="/docs/agent" className="text-link">
                Install and enroll the agent
                <ArrowRight size={16} />
              </SiteLink>
            </>
          )}
        </SheetContent>
      </Sheet>
      {!embedded && <ClosingCta />}
    </div>
  );
}
