import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Box,
  Braces,
  ChevronDown,
  CircleCheck,
  Clock3,
  Cpu,
  FileText,
  GitBranch,
  Layers,
  LayoutDashboard,
  Network,
  Search,
  Settings2,
  Shield,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Brand } from "./SiteChrome";
import { SiteLink } from "@/lib/navigation";

const services = [
  {
    name: "checkout-api",
    language: "Node.js",
    requests: "1.8k",
    latency: "142 ms",
    error: "0.12%",
    state: "Healthy",
    icon: Braces,
  },
  {
    name: "payment-service",
    language: "Go",
    requests: "946",
    latency: "284 ms",
    error: "1.84%",
    state: "Degraded",
    icon: Box,
  },
  {
    name: "inventory-worker",
    language: "Python",
    requests: "724",
    latency: "38 ms",
    error: "0.03%",
    state: "Healthy",
    icon: Layers,
  },
];

export function LatencyChart({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={compact ? "latency-chart compact" : "latency-chart"}
      viewBox="0 0 560 165"
      fill="none"
      role="img"
      aria-label="Illustrative service latency over the last hour, with p95 and p50 series"
    >
      <defs>
        <linearGradient
          id={compact ? "latencyFillCompact" : "latencyFill"}
          x1="0"
          y1="25"
          x2="0"
          y2="165"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-purple)" stopOpacity=".22" />
          <stop offset="1" stopColor="var(--chart-purple)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 65, 105, 145].map((y, i) => (
        <g key={y}>
          <path
            d={`M35 ${y}H555`}
            stroke="var(--border)"
            strokeDasharray="3 5"
          />
          <text
            x="0"
            y={y + 4}
            fill="var(--text-muted)"
            fontSize="9"
            fontFamily="Inter Variable, sans-serif"
          >
            {[300, 200, 100, 0][i]}
          </text>
        </g>
      ))}
      <path
        d="M35 116 47 118 59 104 71 112 83 107 95 114 107 102 119 110 131 99 143 109 155 97 167 110 179 101 191 94 203 107 215 95 227 104 239 90 251 97 263 81 275 97 287 90 299 104 311 71 323 83 335 39 347 60 359 30 371 51 383 23 395 64 407 51 419 84 431 91 443 81 455 95 467 88 479 104 491 93 503 100 515 88 527 101 539 95 555 99V145H35Z"
        fill={`url(#${compact ? "latencyFillCompact" : "latencyFill"})`}
      />
      <path
        d="M35 116 47 118 59 104 71 112 83 107 95 114 107 102 119 110 131 99 143 109 155 97 167 110 179 101 191 94 203 107 215 95 227 104 239 90 251 97 263 81 275 97 287 90 299 104 311 71 323 83 335 39 347 60 359 30 371 51 383 23 395 64 407 51 419 84 431 91 443 81 455 95 467 88 479 104 491 93 503 100 515 88 527 101 539 95 555 99"
        stroke="var(--chart-purple)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M35 133 59 128 83 134 107 129 131 132 155 126 179 131 203 124 227 132 251 128 275 124 299 129 323 122 347 127 371 121 395 126 419 130 443 123 467 129 491 126 515 130 539 125 555 128"
        stroke="var(--success-text)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {[35, 139, 243, 347, 451, 539].map((x, i) => (
        <text
          key={x}
          x={x}
          y="162"
          fill="var(--text-muted)"
          fontSize="9"
          fontFamily="Inter Variable, sans-serif"
        >
          {["09:00", "09:10", "09:20", "09:30", "09:40", "09:50"][i]}
        </text>
      ))}
    </svg>
  );
}

export function ServiceMap({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`service-map ${small ? "small" : ""}`}
      aria-label="Example service dependencies: browser to checkout to payments, database, and inventory"
    >
      <svg viewBox="0 0 350 190" fill="none" aria-hidden="true">
        <path
          d="M70 95H165M175 90 273 43M175 95H273M175 100 273 147"
          stroke="var(--border-strong)"
          strokeWidth="1.3"
        />
        <path
          d="M70 95H165M175 90 273 43M175 95H273M175 100 273 147"
          stroke="var(--chart-purple)"
          strokeWidth="1.3"
          strokeDasharray="3 15"
          className="flow-path"
        />
        <circle cx="110" cy="95" r="2.5" fill="var(--accent-bright)" />
      </svg>
      <span className="map-node browser">
        <Box size={17} />
        <small>browser</small>
      </span>
      <span className="map-node checkout">
        <Braces size={19} />
        <small>checkout-api</small>
      </span>
      <span className="map-node payments warning">
        <Box size={15} />
        <small>payments</small>
        <i />
      </span>
      <span className="map-node postgres">
        <Layers size={15} />
        <small>postgres</small>
      </span>
      <span className="map-node inventory">
        <Cpu size={15} />
        <small>inventory</small>
      </span>
    </div>
  );
}

function ServiceTable({
  full = false,
  query = "",
}: {
  full?: boolean;
  query?: string;
}) {
  const rows = services.filter(
    (service) =>
      service.name.includes(query.toLowerCase()) ||
      service.language.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="preview-service-table">
      <div className="preview-table-head">
        <span>Service name</span>
        <span>Requests / min</span>
        <span>p95 latency</span>
        <span>Error rate</span>
        <span>Status</span>
      </div>
      {rows.map(({ icon: Icon, ...service }) => (
        <div className="preview-service-row" key={service.name}>
          <span className="preview-service-name">
            <Icon size={15} />
            <span>
              {service.name}
              {full && <small>{service.language} · production</small>}
            </span>
          </span>
          <span>{service.requests}</span>
          <span>{service.latency}</span>
          <span className={service.state === "Degraded" ? "amber-text" : ""}>
            {service.error}
          </span>
          <span
            className={`preview-state ${service.state === "Healthy" ? "healthy" : "degraded"}`}
          >
            <i />
            {service.state}
          </span>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="preview-empty">
          No services match “{query}”. Try checkout, payments, or Python.
        </p>
      )}
    </div>
  );
}

export function ProductPreview() {
  const [query, setQuery] = useState("");
  return (
    <div className="product-preview-wrap" id="platform-preview">
      <div className="preview-glow" aria-hidden="true" />
      <Tabs defaultValue="overview" className="product-preview">
        <aside className="preview-sidebar">
          <div className="preview-brand">
            <Brand compact />
            <span>
              nexusobserve<span>workspace</span>
            </span>
          </div>
          <div className="preview-workspace">
            <span className="workspace-avatar">N</span>
            <span>
              Nexus workspace<small>Community Edition</small>
            </span>
            <ChevronDown size={12} />
          </div>
          <span className="preview-nav-label">OBSERVABILITY</span>
          <TabsList
            aria-label="Explore the example workspace"
            className="preview-tabs"
          >
            <TabsTrigger value="overview">
              <LayoutDashboard size={15} />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="services">
              <Network size={15} />
              <span>Services</span>
              <span className="preview-count">24</span>
            </TabsTrigger>
            <TabsTrigger value="traces">
              <GitBranch size={15} />
              <span>Traces</span>
            </TabsTrigger>
            <TabsTrigger value="logs">
              <FileText size={15} />
              <span>Logs</span>
            </TabsTrigger>
          </TabsList>
          <span className="preview-nav-label secondary-label">OPERATIONS</span>
          <SiteLink href="/opentelemetry/fleet" className="preview-side-link">
            <Cpu size={15} />
            Infrastructure
          </SiteLink>
          <SiteLink href="/product" className="preview-side-link">
            <TriangleAlert size={15} />
            Incidents<span className="incident-count">2</span>
          </SiteLink>
          <SiteLink href="/docs/mcp" className="preview-side-link">
            <Sparkles size={15} />
            AI investigation
          </SiteLink>
          <div className="preview-sidebar-bottom">
            <Shield size={14} />
            <span>Self-hosted & secure</span>
            <Settings2 size={13} />
          </div>
        </aside>
        <div className="preview-main">
          <div className="preview-topbar">
            <span>
              <span className="preview-breadcrumb">Workspace</span>
              <span>/</span>Production
            </span>
            <span className="preview-sample">
              <i /> Example environment
            </span>
          </div>
          <TabsContent value="overview" className="preview-content">
            <div className="preview-page-heading">
              <div>
                <h3>Production overview</h3>
                <p>Your services, signals, and incidents. Connected.</p>
              </div>
              <span className="preview-time">
                <Clock3 size={12} />
                Last 1 hour
                <ChevronDown size={10} />
              </span>
            </div>
            <div className="preview-metrics">
              {[
                {
                  label: "Active services",
                  value: "24",
                  note: "All reporting",
                  icon: Network,
                },
                {
                  label: "Availability",
                  value: "99.97",
                  unit: "%",
                  note: "Within SLO",
                  icon: CircleCheck,
                },
                {
                  label: "p95 latency",
                  value: "142",
                  unit: "ms",
                  note: "12% from previous hour",
                  icon: Activity,
                },
                {
                  label: "Open incidents",
                  value: "2",
                  note: "1 needs attention",
                  icon: TriangleAlert,
                },
              ].map((metric, i) => (
                <Card className="preview-metric" key={metric.label}>
                  <span>
                    {metric.label}
                    <metric.icon size={13} />
                  </span>
                  <strong>
                    {metric.value}
                    <small>{metric.unit}</small>
                  </strong>
                  <span
                    className={
                      i === 3 ? "amber-text metric-note" : "metric-note"
                    }
                  >
                    {i === 2 ? <ArrowDownRight size={11} /> : <i />}
                    {metric.note}
                  </span>
                </Card>
              ))}
            </div>
            <div className="preview-chart-grid">
              <Card className="preview-panel">
                <div className="preview-panel-heading">
                  <h4>Service latency</h4>
                  <div className="chart-legend">
                    <span>
                      <i />
                      p95
                    </span>
                    <span>
                      <i />
                      p50
                    </span>
                  </div>
                </div>
                <LatencyChart />
              </Card>
              <Card className="preview-panel topology-panel">
                <div className="preview-panel-heading">
                  <h4>Service topology</h4>
                  <span className="topology-live">
                    <i />
                    Connected
                  </span>
                </div>
                <ServiceMap />
              </Card>
            </div>
            <Card className="preview-panel preview-services">
              <div className="preview-panel-heading">
                <h4>Your services</h4>
                <SiteLink href="/product">
                  Explore platform
                  <ArrowRight size={11} />
                </SiteLink>
              </div>
              <ServiceTable />
            </Card>
          </TabsContent>
          <TabsContent value="services" className="preview-content">
            <div className="preview-page-heading">
              <div>
                <h3>Service catalog</h3>
                <p>Find the service. Follow its dependencies.</p>
              </div>
              <span className="preview-state healthy">
                <i />
                24 reporting
              </span>
            </div>
            <label className="preview-search">
              <Search size={15} />
              <input
                aria-label="Search example services"
                placeholder="Search services or runtimes…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <ServiceTable full query={query} />
            <div className="preview-detail-panel">
              <Network size={22} />
              <div>
                <h4>Context travels with your services.</h4>
                <p>
                  Connect ownership, deployments, dependencies, and telemetry to
                  the same service identity.
                </p>
              </div>
              <SiteLink href="/product">
                <ArrowRight size={16} />
              </SiteLink>
            </div>
          </TabsContent>
          <TabsContent value="traces" className="preview-content">
            <div className="preview-page-heading">
              <div>
                <h3>Distributed traces</h3>
                <p>Follow a request from browser to database.</p>
              </div>
              <span className="preview-time">
                <GitBranch size={12} />
                checkout-api
              </span>
            </div>
            <div className="trace-summary">
              <span className="trace-method">POST</span>
              <strong>/api/checkout</strong>
              <span>142 ms</span>
              <span className="preview-state healthy">
                <i />
                200 OK
              </span>
            </div>
            <div className="trace-waterfall">
              <div className="waterfall-scale">
                <span>Span</span>
                <span>0 ms</span>
                <span>50 ms</span>
                <span>100 ms</span>
                <span>150 ms</span>
              </div>
              {[
                {
                  name: "POST /api/checkout",
                  start: 0,
                  width: 94,
                  time: "142 ms",
                  level: 0,
                },
                {
                  name: "validate.cart",
                  start: 5,
                  width: 14,
                  time: "21 ms",
                  level: 1,
                },
                {
                  name: "inventory.reserve",
                  start: 20,
                  width: 24,
                  time: "36 ms",
                  level: 1,
                },
                {
                  name: "payment.authorize",
                  start: 45,
                  width: 43,
                  time: "64 ms",
                  level: 1,
                },
                {
                  name: "db.query INSERT orders",
                  start: 82,
                  width: 10,
                  time: "15 ms",
                  level: 2,
                },
              ].map((span, i) => (
                <div className="waterfall-row" key={span.name}>
                  <span style={{ paddingLeft: span.level * 12 }}>
                    <GitBranch size={12} />
                    {span.name}
                  </span>
                  <div>
                    <i
                      style={{
                        left: `${span.start}%`,
                        width: `${span.width}%`,
                      }}
                      className={`span-color-${i}`}
                    />
                    <small>{span.time}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="trace-evidence">
              <FileText size={16} />
              <span>
                Trace context connects application logs to the same request.
              </span>
              <SiteLink href="/docs/opentelemetry">
                Connect your application
                <ArrowRight size={12} />
              </SiteLink>
            </div>
          </TabsContent>
          <TabsContent value="logs" className="preview-content">
            <div className="preview-page-heading">
              <div>
                <h3>Log explorer</h3>
                <p>Every event, with the context to explain it.</p>
              </div>
              <span className="preview-time">
                <FileText size={12} />
                Structured logs
              </span>
            </div>
            <div className="log-query">
              <Search size={14} />
              <code>service.name = "checkout-api"</code>
              <span>Example query</span>
            </div>
            <div className="preview-log-list">
              {[
                {
                  time: "09:48:12.842",
                  level: "INFO",
                  message: "Request completed",
                  detail: "POST /api/checkout · 142 ms · trace_id: 7b9c…",
                },
                {
                  time: "09:48:12.827",
                  level: "INFO",
                  message: "Order persisted",
                  detail: "order_id: ord_8412 · db.system: postgresql",
                },
                {
                  time: "09:48:12.763",
                  level: "WARN",
                  message: "Payment authorization retry",
                  detail: "attempt: 2 · upstream: payment-service",
                },
                {
                  time: "09:48:12.721",
                  level: "INFO",
                  message: "Inventory reserved",
                  detail: "items: 3 · warehouse: eu-west",
                },
                {
                  time: "09:48:12.700",
                  level: "INFO",
                  message: "Checkout request received",
                  detail: "http.method: POST · service.version: 1.8.2",
                },
              ].map((log) => (
                <div className="preview-log-row" key={log.time}>
                  <time>{log.time}</time>
                  <span
                    className={`log-level ${log.level === "WARN" ? "warn" : ""}`}
                  >
                    {log.level}
                  </span>
                  <div>
                    <strong>{log.message}</strong>
                    <code>{log.detail}</code>
                  </div>
                </div>
              ))}
            </div>
            <div className="trace-evidence">
              <Shield size={16} />
              <span>
                Process and redact sensitive fields in your Collector pipeline.
              </span>
              <SiteLink href="/opentelemetry/pipelines">
                Explore pipelines
                <ArrowRight size={12} />
              </SiteLink>
            </div>
          </TabsContent>
          <div className="preview-statusbar">
            <span>
              <i />
              OTLP receiver healthy
            </span>
            <span>Traces · Metrics · Logs</span>
            <span>
              <Shield size={10} />
              Your infrastructure
            </span>
          </div>
        </div>
      </Tabs>
      <p className="preview-caption">
        <span className="caption-line" />
        ONE WORKSPACE. THE WHOLE PICTURE.
        <span className="caption-line" />
      </p>
    </div>
  );
}
