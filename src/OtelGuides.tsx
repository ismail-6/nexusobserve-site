import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  Clipboard,
  Code2,
  FileCode2,
  GitBranch,
  RadioTower,
  Server,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type GuideSection = { heading: string; body: string; steps?: string[]; code?: string; note?: string };
type Guide = { title: string; eyebrow: string; summary: string; icon: LucideIcon; time: string; audience: string; sections: GuideSection[] };

export const otelGuides: Record<string, Guide> = {
  "choose-a-deployment-model": {
    title: "Choose an OpenTelemetry deployment model", eyebrow: "Architecture", icon: GitBranch, time: "8 min", audience: "Platform teams", summary: "Decide between direct OTLP, agent Collectors, gateways, managed configuration and GitOps without making gateways mandatory.",
    sections: [
      { heading: "Start with ownership", body: "Choose who applies configuration before choosing topology. Managed mode uses OpAMP enrollment. GitOps keeps Git authoritative. Generated mode produces deployable artifacts. Imported mode is read-only.", steps: ["Use direct OTLP for initial SDK validation and small controlled workloads.", "Use an agent Collector when host-local receiving, enrichment or buffering is valuable.", "Add a gateway for tail sampling, centralized egress, protocol conversion or stateful processing.", "Use GitOps when production changes already require pull requests and deployment automation."] },
      { heading: "Do not mandate a gateway", body: "A gateway adds a network hop and another scaling responsibility. Recommend it only when the workload needs shared processing, network isolation, durable queues, tail sampling or centralized credentials.", note: "NexusObserve should recommend a topology from workload facts, while always letting the customer inspect and change it." },
      { heading: "Production default", body: "A common resilient layout is SDK → local or node Collector → NexusObserve. Add a gateway only for workloads that benefit from it." },
    ],
  },
  "connect-a-data-source": {
    title: "Connect any data source", eyebrow: "Data sources", icon: RadioTower, time: "9 min", audience: "Observability teams", summary: "Choose a source by the system being monitored, understand its collection method, and generate a reviewable OpenTelemetry pipeline.",
    sections: [
      { heading: "Start from the system", body: "Open Data sources and search for the technology or protocol. Sources are grouped into applications, hosts, orchestration, cloud, metrics, databases, messaging, web infrastructure, logs, networks, developer systems, experience and migration paths." },
      { heading: "Understand the collection method", body: "The source page states how data is acquired before asking for configuration.", steps: ["SDK / OTLP sends telemetry from an instrumented application.", "Protocol and streaming receivers listen for compatible incoming data.", "Host-local and file receivers run close to the monitored system.", "Prometheus receivers pull exposed metric endpoints.", "Cloud and database receivers authenticate to provider APIs.", "Synthetic probes actively test an endpoint from a selected location."] },
      { heading: "Configure ownership", body: "Choose Managed for OpAMP delivery, GitOps to keep Git authoritative, or Generate only when the operator will apply the artifact. Gateways remain optional in all three models." },
      { heading: "Review the starter configuration", body: "Inspect the receiver ID, resource attributes, processors, exporter and pipeline before saving. Generated output deliberately uses runtime secret references.", note: "A catalog template is a starting point. Validate it against the exact Collector distribution and component version before deployment." },
      { heading: "Verify actual telemetry", body: "After deployment, confirm accepted and exported counts, expected resource identity, signal continuity and destination visibility. Mark configuration as effective only when the Collector reports it; otherwise show it as generated or unverified." },
    ],
  },
  "instrument-an-application": {
    title: "Instrument an application", eyebrow: "Applications", icon: Code2, time: "10 min", audience: "Developers", summary: "Send useful traces, metrics and logs while preserving consistent service identity across environments.",
    sections: [
      { heading: "Define service identity", body: "Set stable service and ownership attributes before sending data. This identity connects signals, deployments, alerts and cost allocation.", code: "export OTEL_SERVICE_NAME=checkout-api\nexport OTEL_RESOURCE_ATTRIBUTES=service.namespace=commerce,service.version=1.4.2,deployment.environment.name=production,team.name=payments" },
      { heading: "Configure OTLP export", body: "Use the scoped endpoint and secret created by NexusObserve. HTTP/protobuf is often easiest through existing proxies; gRPC is equally supported where the network permits it.", code: "export OTEL_EXPORTER_OTLP_ENDPOINT=https://otel.example.com\nexport OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf\nexport OTEL_EXPORTER_OTLP_HEADERS=authorization=Bearer%20<TOKEN>" },
      { heading: "Verify usefulness", body: "Receiving data is only the first check.", steps: ["Confirm the service appears with the expected environment and owner.", "Open a trace and verify server, client and database spans connect.", "Confirm errors retain useful status and exception information.", "Verify log records include trace and span IDs where supported."] },
    ],
  },
  "deploy-a-managed-collector": {
    title: "Deploy a managed Collector", eyebrow: "Fleet", icon: RadioTower, time: "12 min", audience: "Operators", summary: "Enroll a Collector through OpAMP so NexusObserve can distribute configuration and verify effective state.",
    sections: [
      { heading: "Create an enrollment", body: "Create a short-lived, scope-limited enrollment token. The resulting Collector identity is separate from the token and can be revoked independently.", steps: ["Choose the environment and fleet labels.", "Set the token lifetime to the minimum practical duration.", "Select the Collector distribution and available components.", "Copy the generated command or Kubernetes secret reference."] },
      { heading: "Persist supervisor state", body: "The OpAMP Supervisor requires persistent state so the Collector retains identity and last-known configuration through restarts.", code: "docker run --rm \\\n  -e NEXUSOBSERVE_ENROLLMENT_TOKEN=<ONE_TIME_TOKEN> \\\n  -e NEXUSOBSERVE_CONTROL_URL=https://observe.example.com \\\n  -v otel-state:/var/lib/otelcol \\\n  nexusobserve/otel-collector:latest" },
      { heading: "Confirm reconciliation", body: "The Fleet view should show the Collector as connected, its distribution and component inventory, desired revision, reported effective revision, and live health." },
    ],
  },
  "kubernetes-collection": {
    title: "Collect Kubernetes telemetry", eyebrow: "Kubernetes", icon: Boxes, time: "15 min", audience: "Platform teams", summary: "Choose DaemonSet, Deployment or mixed Collector layouts and collect cluster data without unnecessary gateways.",
    sections: [
      { heading: "Choose the Collector roles", body: "Use DaemonSets for node-local logs and host metrics. Use a Deployment for cluster-wide receivers that must have one active instance. A gateway Deployment is optional.", steps: ["DaemonSet: file logs, kubelet stats and host metrics.", "Single or leader-elected Deployment: cluster events and cluster metrics.", "Gateway: tail sampling, centralized egress or shared stateful processors."] },
      { heading: "Install generated values", body: "Review the rendered Helm values and RBAC before deployment.", code: "helm upgrade --install nexus-otel open-telemetry/opentelemetry-collector \\\n  --namespace observability --create-namespace \\\n  -f nexusobserve-values.yaml" },
      { heading: "Verify coverage", body: "Confirm every expected node reports, cluster receivers do not run duplicate scrapes, and logs carry namespace, pod, container, workload and cluster identity." },
    ],
  },
  "centralized-configuration": {
    title: "Use centralized configuration", eyebrow: "Configuration", icon: FileCode2, time: "11 min", audience: "Observability teams", summary: "Understand desired, effective and observed configuration and safely handle systems NexusObserve does not control.",
    sections: [
      { heading: "Read the three states", body: "Desired is what NexusObserve or Git declares. Effective is what an enrolled Collector reports. Observed is what telemetry and self-monitoring prove. These states may differ during rollout or drift." },
      { heading: "Select an ownership mode", body: "Ownership is explicit for every configuration.", steps: ["Managed: NexusObserve distributes revisions through OpAMP.", "GitOps: NexusObserve proposes or reads Git changes and observes deployment.", "Generated: NexusObserve produces artifacts for the operator to apply.", "Imported: NexusObserve validates and visualizes but cannot claim remote control."] },
      { heading: "Handle secrets safely", body: "Store secret references, not secret values, in desired configuration and revision diffs. Resolve values at runtime from Kubernetes Secrets, environment variables, Vault or the selected provider.", note: "Telemetry alone cannot reveal every SDK environment variable or local Collector override. NexusObserve labels inferred and unverified state honestly." },
    ],
  },
  "safe-config-rollouts": {
    title: "Roll out configuration safely", eyebrow: "Operations", icon: ShieldCheck, time: "9 min", audience: "SRE teams", summary: "Validate, canary, measure and roll back Collector changes using the same discipline as application deployments.",
    sections: [
      { heading: "Run preflight checks", body: "Validate syntax, component availability, pipeline references, secrets, network endpoints and estimated memory before targeting a live Collector." },
      { heading: "Canary the change", body: "Start with one representative Collector and hold promotion until health gates pass.", steps: ["Collector remains connected and does not restart-loop.", "Receiver refusal and exporter failure stay below thresholds.", "Queues remain bounded and memory stays below the limiter.", "Expected services and signals continue without a gap."] },
      { heading: "Preserve last-known-good", body: "Keep the previous effective revision locally and in the control plane. Roll back automatically when hard health gates fail; make manual rollback one action with an audit reason." },
    ],
  },
  "build-processing-pipelines": {
    title: "Build processing pipelines", eyebrow: "Pipelines", icon: Server, time: "12 min", audience: "Telemetry engineers", summary: "Protect Collectors, enrich resources, remove sensitive data, control volume and route signals using standard OTel components.",
    sections: [
      { heading: "Use the safe processor order", body: "Protect the process first, establish identity, transform or redact, sample where appropriate, and batch before export.", code: "processors:\n  memory_limiter:\n    check_interval: 1s\n    limit_mib: 512\n  resource/environment:\n    attributes:\n      - key: deployment.environment.name\n        value: production\n        action: upsert\n  batch:\n    send_batch_size: 8192\n    timeout: 2s" },
      { heading: "Test with representative data", body: "Validate transforms, parsers, filters and redaction against samples containing expected fields, malformed records and sensitive values." },
      { heading: "Measure the result", body: "Compare input and output counts, bytes, rejection, processing latency, CPU and memory before promoting the revision." },
    ],
  },
  "troubleshoot-telemetry": {
    title: "Troubleshoot missing telemetry", eyebrow: "Troubleshooting", icon: Wrench, time: "10 min", audience: "Everyone", summary: "Work from application export through Collector receiving, processing and destination delivery without guessing.",
    sections: [
      { heading: "Follow the signal path", body: "Check each boundary in order.", steps: ["SDK: exporter enabled, endpoint reachable, credentials present and service identity set.", "Receiver: accepted versus refused counts and protocol/listen address.", "Processors: filter conditions, sampling decisions, transform errors and memory limits.", "Exporter: connection errors, retry queue, rejected items and destination response.", "Backend: tenant, time range, environment filters and ingestion status."] },
      { heading: "Use Collector self-telemetry", body: "Collector internal metrics provide the strongest evidence for accepted, refused, processed, queued and exported telemetry. Configuration status alone is insufficient." },
      { heading: "Treat partial state as partial", body: "For an imported Collector without reporting, NexusObserve can infer that data is arriving but cannot verify its complete running configuration." },
    ],
  },
};

export function getGuideMeta(slug: string) { return otelGuides[slug]; }

function GuideLink({ href, className, onNavigate, children }: { href: string; className?: string; onNavigate: (href: string) => void; children: React.ReactNode }) {
  return <a href={href} className={className} onClick={(e)=>{e.preventDefault();onNavigate(href)}}>{children}</a>;
}

export function GuidesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const entries = Object.entries(otelGuides);
  return <>
    <section className="guides-hero section-frame"><p className="eyebrow">OpenTelemetry guides</p><h1>From first signal to a safe production rollout.</h1><p>Practical guides for choosing a topology, instrumenting services, operating Collector fleets, managing configuration and troubleshooting the complete telemetry path.</p><div className="hero-actions"><GuideLink href="/guides/choose-a-deployment-model" className="button primary" onNavigate={onNavigate}>Start with deployment models <ArrowRight size={17}/></GuideLink><GuideLink href="/opentelemetry" className="button secondary" onNavigate={onNavigate}>Open OTel workspace <RadioTower size={17}/></GuideLink></div></section>
    <section className="section-frame guide-library"><div className="guide-library-head"><div><span className="eyebrow">Guide library</span><h2>Use the path that matches your task.</h2></div><p>Practical patterns for instrumentation, collection, configuration, and troubleshooting. Start with the task you need to solve.</p></div><div className="guide-grid">{entries.map(([slug,guide],index)=>{const Icon=guide.icon;return <GuideLink href={`/guides/${slug}`} className={index===0?'guide-card featured':'guide-card'} onNavigate={onNavigate} key={slug}><div><span className="guide-icon"><Icon size={21}/></span><span className="guide-index">{String(index+1).padStart(2,'0')}</span></div><p className="eyebrow">{guide.eyebrow}</p><h3>{guide.title}</h3><p>{guide.summary}</p><footer><span>{guide.time}</span><span>{guide.audience}</span><ArrowRight size={16}/></footer></GuideLink>})}</div></section>
  </>;
}

export function GuideArticlePage({ slug, copied, onCopy, onNavigate }: { slug: string; copied: string | null; onCopy: (value: string, label: string) => void; onNavigate: (href: string) => void }) {
  const guide = otelGuides[slug];
  if (!guide) return null;
  const Icon=guide.icon;
  return <section className="guide-article-shell section-frame"><aside className="guide-toc"><GuideLink href="/guides" onNavigate={onNavigate}><ArrowRight size={15}/>All OTel guides</GuideLink><span>On this page</span>{guide.sections.map((section)=><a href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} key={section.heading}>{section.heading}</a>)}<div><BookOpen size={17}/><strong>Product workspace</strong><p>Apply these patterns in the centralized OTel experience.</p><GuideLink href="/opentelemetry" onNavigate={onNavigate}>Open workspace <ArrowRight size={14}/></GuideLink></div></aside><article className="guide-article"><header><span className="guide-article-icon"><Icon size={25}/></span><p className="eyebrow">{guide.eyebrow}</p><h1>{guide.title}</h1><p>{guide.summary}</p><div><span>{guide.time} read</span><span>{guide.audience}</span><span>OpenTelemetry</span></div></header>{guide.sections.map((section,index)=>{const id=section.heading.toLowerCase().replace(/[^a-z0-9]+/g,'-');return <section id={id} key={section.heading}><span className="section-number">{String(index+1).padStart(2,'0')}</span><h2>{section.heading}</h2><p>{section.body}</p>{section.steps?<ol>{section.steps.map((step)=><li key={step}><CheckCircle2 size={16}/><span>{step}</span></li>)}</ol>:null}{section.code?<div className="otel-code guide-code"><button onClick={()=>onCopy(section.code!,`${slug}-${index}`)}><Clipboard size={14}/>{copied===`${slug}-${index}`?'Copied':'Copy'}</button><pre><code>{section.code}</code></pre></div>:null}{section.note?<div className="guide-note"><ShieldCheck size={18}/><p>{section.note}</p></div>:null}</section>})}<footer><div><p className="eyebrow">Next step</p><strong>Apply the guide in the OpenTelemetry workspace.</strong></div><GuideLink href="/opentelemetry/setup" className="button primary" onNavigate={onNavigate}>Open setup <ArrowRight size={16}/></GuideLink></footer></article></section>;
}
