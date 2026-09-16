export type OtelSignal =
  | "Traces"
  | "Metrics"
  | "Logs"
  | "Profiles"
  | "Events"
  | "Inventory"
  | "RUM"
  | "Checks";

export type CollectionType =
  | "SDK / OTLP"
  | "Protocol receiver"
  | "Prometheus scrape"
  | "Host-local receiver"
  | "Cloud API"
  | "Streaming"
  | "File / log receiver"
  | "Database receiver"
  | "Synthetic probe"
  | "Browser / mobile SDK"
  | "Vendor bridge"
  | "Custom";

export type SourceField = {
  key: string;
  label: string;
  placeholder: string;
  secret?: boolean;
  optional?: boolean;
};

export type SourceDefinition = {
  id: string;
  name: string;
  category: string;
  description: string;
  receiver: string;
  signals: OtelSignal[];
  collectionType: CollectionType;
  deployments: Array<"Application" | "Agent" | "Gateway" | "Cluster" | "Cloud">;
  maturity: "Stable" | "Beta" | "Preview";
  availability: "Starter config" | "Guided template" | "Preview";
  fields?: SourceField[];
  docs?: string;
};

const endpointFields: SourceField[] = [
  { key: "endpoint", label: "Endpoint", placeholder: "https://service.example.com:443" },
  { key: "username", label: "Username", placeholder: "otel-reader", optional: true },
  { key: "password", label: "Password / token reference", placeholder: "secret://sources/credential", secret: true, optional: true },
];

const cloudFields: SourceField[] = [
  { key: "account", label: "Account or project", placeholder: "production-account" },
  { key: "region", label: "Region", placeholder: "us-east-1" },
  { key: "credential", label: "Credential reference", placeholder: "secret://cloud/production", secret: true },
];

const fileFields: SourceField[] = [
  { key: "path", label: "Include path", placeholder: "/var/log/application/*.log" },
  { key: "format", label: "Log format", placeholder: "json", optional: true },
];

const scrapeFields: SourceField[] = [
  { key: "endpoint", label: "Metrics endpoint", placeholder: "http://localhost:9090/metrics" },
  { key: "interval", label: "Scrape interval", placeholder: "30s", optional: true },
];

const s = (
  id: string,
  name: string,
  category: string,
  description: string,
  receiver: string,
  signals: OtelSignal[],
  collectionType: CollectionType,
  deployments: SourceDefinition["deployments"],
  maturity: SourceDefinition["maturity"] = "Stable",
  availability: SourceDefinition["availability"] = "Starter config",
  fields?: SourceField[],
): SourceDefinition => ({ id, name, category, description, receiver, signals, collectionType, deployments, maturity, availability, fields });

export const otelSourceCatalog: SourceDefinition[] = [
  // Application telemetry and compatible protocols
  s("otlp", "OTLP endpoint", "Applications & APM", "Receive standard OTLP over gRPC or HTTP from any compatible SDK, agent or Collector.", "otlp", ["Traces", "Metrics", "Logs", "Profiles"], "Protocol receiver", ["Application", "Agent", "Gateway"]),
  s("java", "Java", "Applications & APM", "Automatic or manual instrumentation for JVM services, frameworks, HTTP, messaging and database clients.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Stable", "Guided template"),
  s("nodejs", "Node.js", "Applications & APM", "Automatic or manual instrumentation for Node.js servers, frameworks and dependencies.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Stable", "Guided template"),
  s("python", "Python", "Applications & APM", "Automatic or manual instrumentation for Python web, worker and data workloads.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Stable", "Guided template"),
  s("dotnet", ".NET", "Applications & APM", "Automatic or manual instrumentation for ASP.NET, worker services and .NET dependencies.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Stable", "Guided template"),
  s("go", "Go", "Applications & APM", "OpenTelemetry Go SDK setup for HTTP, gRPC, database, messaging and custom spans.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Stable", "Guided template"),
  s("javascript", "Browser JavaScript", "Applications & APM", "Browser tracing and web performance with controlled cross-origin propagation.", "otlp", ["Traces", "RUM", "Events"], "Browser / mobile SDK", ["Application", "Gateway"], "Beta", "Guided template"),
  s("php", "PHP", "Applications & APM", "Automatic or SDK instrumentation for PHP web applications and supported libraries.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Stable", "Guided template"),
  s("ruby", "Ruby", "Applications & APM", "OpenTelemetry instrumentation for Rails, Rack, jobs, databases and HTTP clients.", "otlp", ["Traces", "Metrics"], "SDK / OTLP", ["Application"], "Stable", "Guided template"),
  s("rust", "Rust", "Applications & APM", "SDK instrumentation and tracing ecosystem bridge for Rust applications.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Beta", "Guided template"),
  s("swift", "Swift / iOS", "Applications & APM", "Mobile traces, network spans, crashes and application events from Swift clients.", "otlp", ["Traces", "RUM", "Events"], "Browser / mobile SDK", ["Application", "Gateway"], "Beta", "Guided template"),
  s("android", "Android", "Applications & APM", "Android application telemetry, network spans, crashes and mobile experience signals.", "otlp", ["Traces", "RUM", "Events"], "Browser / mobile SDK", ["Application", "Gateway"], "Beta", "Guided template"),
  s("cpp", "C++", "Applications & APM", "Native OpenTelemetry SDK telemetry for C++ services and embedded runtimes.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application"], "Beta", "Guided template"),
  s("erlang", "Erlang / Elixir", "Applications & APM", "BEAM application instrumentation exported through OTLP.", "otlp", ["Traces", "Metrics"], "SDK / OTLP", ["Application"], "Beta", "Guided template"),
  s("jaeger", "Jaeger", "Applications & APM", "Receive Jaeger gRPC, Thrift HTTP or compact Thrift trace traffic during migration.", "jaeger", ["Traces"], "Protocol receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("zipkin", "Zipkin", "Applications & APM", "Receive Zipkin v2 JSON or protobuf spans without changing existing senders first.", "zipkin", ["Traces"], "Protocol receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("opencensus", "OpenCensus", "Applications & APM", "Bridge legacy OpenCensus instrumentation into standard OTel pipelines.", "opencensus", ["Traces", "Metrics"], "Protocol receiver", ["Agent", "Gateway"], "Beta", "Starter config", endpointFields),
  s("skywalking", "Apache SkyWalking", "Applications & APM", "Receive SkyWalking trace segments and management data for staged migration.", "skywalking", ["Traces"], "Protocol receiver", ["Gateway"], "Beta", "Starter config", endpointFields),

  // Hosts, runtimes and orchestration
  s("linux", "Linux host", "Hosts & operating systems", "CPU, memory, load, filesystem, disk, network, paging and process metrics.", "hostmetrics", ["Metrics"], "Host-local receiver", ["Agent"], "Stable", "Starter config"),
  s("windows", "Windows host", "Hosts & operating systems", "Windows host metrics with optional event logs and performance counters.", "hostmetrics + windowseventlog", ["Metrics", "Logs", "Events"], "Host-local receiver", ["Agent"], "Stable", "Guided template", fileFields),
  s("macos", "macOS host", "Hosts & operating systems", "Host resource telemetry for controlled macOS workstation and build infrastructure.", "hostmetrics", ["Metrics"], "Host-local receiver", ["Agent"], "Stable", "Starter config"),
  s("journald", "systemd journal", "Hosts & operating systems", "Read and enrich Linux service logs from journald.", "journald", ["Logs"], "File / log receiver", ["Agent"], "Beta", "Starter config", fileFields),
  s("windows-events", "Windows Event Log", "Hosts & operating systems", "Collect selected Application, System, Security or custom Windows event channels.", "windowseventlog", ["Logs", "Events"], "File / log receiver", ["Agent"], "Stable", "Starter config", fileFields),
  s("systemd", "systemd services", "Hosts & operating systems", "Service state, restart and failure telemetry through host-local templates.", "hostmetrics + filelog", ["Metrics", "Logs", "Events"], "Host-local receiver", ["Agent"], "Stable", "Guided template"),
  s("processes", "Processes", "Hosts & operating systems", "Per-process CPU, memory, disk and runtime metadata with explicit allowlists.", "hostmetrics", ["Metrics", "Inventory"], "Host-local receiver", ["Agent"], "Stable", "Starter config"),
  s("docker", "Docker", "Containers & orchestration", "Container CPU, memory, network, block I/O, metadata and container logs.", "docker_stats + filelog", ["Metrics", "Logs", "Inventory"], "Host-local receiver", ["Agent"], "Stable", "Guided template", endpointFields),
  s("containerd", "containerd / CRI", "Containers & orchestration", "CRI container logs and runtime resource telemetry on Kubernetes or standalone hosts.", "filelog + hostmetrics", ["Metrics", "Logs", "Inventory"], "Host-local receiver", ["Agent"], "Stable", "Guided template", fileFields),
  s("kubernetes", "Kubernetes", "Containers & orchestration", "Complete node, pod, container, workload, cluster, event and control-plane collection.", "kubeletstats + k8s_cluster + filelog", ["Metrics", "Logs", "Events", "Inventory"], "Host-local receiver", ["Agent", "Cluster", "Gateway"], "Stable", "Guided template"),
  s("kubelet", "Kubelet statistics", "Containers & orchestration", "Node, pod, container and volume metrics directly from each kubelet.", "kubeletstats", ["Metrics", "Inventory"], "Host-local receiver", ["Agent"], "Stable", "Starter config", endpointFields),
  s("k8s-cluster", "Kubernetes cluster state", "Containers & orchestration", "Cluster-level workload state, quotas, nodes and resource metadata.", "k8s_cluster", ["Metrics", "Inventory"], "Host-local receiver", ["Cluster"], "Stable", "Starter config"),
  s("k8s-objects", "Kubernetes objects & events", "Containers & orchestration", "Watch selected Kubernetes objects and cluster events as structured logs.", "k8sobjects", ["Logs", "Events", "Inventory"], "Host-local receiver", ["Cluster"], "Beta", "Starter config"),
  s("openshift", "Red Hat OpenShift", "Containers & orchestration", "Kubernetes telemetry plus OpenShift platform, router and operator templates.", "kubeletstats + prometheus + filelog", ["Metrics", "Logs", "Events", "Inventory"], "Host-local receiver", ["Agent", "Cluster"], "Stable", "Guided template"),
  s("ecs", "Amazon ECS", "Containers & orchestration", "ECS task, container, service and resource metadata with CloudWatch integration.", "awsecscontainermetrics", ["Metrics", "Logs", "Inventory"], "Cloud API", ["Agent", "Cloud"], "Stable", "Guided template", cloudFields),
  s("nomad", "HashiCorp Nomad", "Containers & orchestration", "Nomad cluster and workload metrics through Prometheus endpoints and logs.", "prometheus + filelog", ["Metrics", "Logs", "Inventory"], "Prometheus scrape", ["Agent", "Cluster"], "Stable", "Guided template", scrapeFields),

  // Cloud platforms
  s("aws-cloudwatch", "AWS CloudWatch", "Cloud platforms", "Discover and retrieve metrics from supported AWS services and namespaces.", "awscloudwatch", ["Metrics", "Inventory"], "Cloud API", ["Cloud", "Gateway"], "Stable", "Starter config", cloudFields),
  s("aws-firehose", "Amazon Data Firehose", "Cloud platforms", "Receive CloudWatch logs and metrics delivered through Amazon Data Firehose.", "awsfirehose", ["Metrics", "Logs"], "Streaming", ["Cloud", "Gateway"], "Stable", "Starter config", endpointFields),
  s("aws-xray", "AWS X-Ray", "Cloud platforms", "Receive X-Ray segments locally and export them through the unified trace pipeline.", "awsxray", ["Traces"], "Protocol receiver", ["Agent", "Gateway"], "Stable", "Starter config"),
  s("aws-container-insights", "AWS Container Insights", "Cloud platforms", "EKS and ECS infrastructure telemetry from CloudWatch Container Insights.", "awscloudwatch", ["Metrics", "Logs", "Inventory"], "Cloud API", ["Cloud", "Gateway"], "Stable", "Guided template", cloudFields),
  s("aws-s3-logs", "AWS S3 logs", "Cloud platforms", "Consume CloudTrail, VPC Flow, ELB, CloudFront, WAF and application logs from S3 notifications.", "awss3", ["Logs", "Events"], "Cloud API", ["Cloud", "Gateway"], "Beta", "Guided template", cloudFields),
  s("aws-lambda", "AWS Lambda", "Cloud platforms", "Serverless traces, enhanced metrics and logs through OTel Lambda layers and extensions.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application", "Cloud"], "Stable", "Guided template", cloudFields),
  s("azure-monitor", "Azure Monitor", "Cloud platforms", "Collect Azure resource metrics from subscriptions and resource groups.", "azuremonitor", ["Metrics", "Inventory"], "Cloud API", ["Cloud", "Gateway"], "Stable", "Starter config", cloudFields),
  s("azure-event-hubs", "Azure Event Hubs", "Cloud platforms", "Stream Azure platform, activity, resource and application logs.", "azureeventhub", ["Logs", "Events"], "Streaming", ["Cloud", "Gateway"], "Stable", "Starter config", endpointFields),
  s("azure-functions", "Azure Functions", "Cloud platforms", "Serverless traces, metrics and logs exported from instrumented functions.", "otlp", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application", "Cloud"], "Stable", "Guided template", cloudFields),
  s("gcp-monitoring", "Google Cloud Monitoring", "Cloud platforms", "Collect metrics from Google Cloud services using monitored-resource mappings.", "googlecloudmonitoring", ["Metrics", "Inventory"], "Cloud API", ["Cloud", "Gateway"], "Beta", "Starter config", cloudFields),
  s("gcp-pubsub", "Google Cloud Pub/Sub", "Cloud platforms", "Receive Google Cloud logs and events exported through a Pub/Sub subscription.", "googlecloudpubsub", ["Logs", "Events"], "Streaming", ["Cloud", "Gateway"], "Stable", "Starter config", endpointFields),
  s("cloud-run", "Google Cloud Run", "Cloud platforms", "Application traces, metrics and logs from Cloud Run services through OTLP and Cloud APIs.", "otlp + googlecloudpubsub", ["Traces", "Metrics", "Logs"], "SDK / OTLP", ["Application", "Cloud"], "Stable", "Guided template", cloudFields),

  // Metrics and protocols
  s("prometheus", "Prometheus scrape", "Metrics & protocols", "Discover and scrape Prometheus or OpenMetrics targets with relabeling support.", "prometheus", ["Metrics"], "Prometheus scrape", ["Agent", "Gateway", "Cluster"], "Stable", "Starter config", scrapeFields),
  s("prometheus-remote-write", "Prometheus remote write", "Metrics & protocols", "Receive Prometheus remote write traffic from existing servers and agents.", "prometheusremotewrite", ["Metrics"], "Protocol receiver", ["Gateway"], "Stable", "Starter config", endpointFields),
  s("statsd", "StatsD", "Metrics & protocols", "Receive StatsD counters, gauges, timings and sets over UDP or TCP.", "statsd", ["Metrics"], "Protocol receiver", ["Agent", "Gateway"], "Beta", "Starter config", endpointFields),
  s("collectd", "collectd", "Metrics & protocols", "Bridge collectd installations through the collectd network protocol.", "collectd", ["Metrics"], "Protocol receiver", ["Agent", "Gateway"], "Beta", "Starter config", endpointFields),
  s("carbon", "Carbon / Graphite", "Metrics & protocols", "Receive legacy Graphite plaintext metrics through a Carbon protocol listener.", "carbon", ["Metrics"], "Protocol receiver", ["Gateway"], "Beta", "Starter config", endpointFields),
  s("influxdb", "InfluxDB line protocol", "Metrics & protocols", "Receive InfluxDB line protocol metrics from compatible Telegraf and application clients.", "influxdb", ["Metrics"], "Protocol receiver", ["Gateway"], "Stable", "Starter config", endpointFields),
  s("jmx", "JMX", "Metrics & protocols", "Collect curated JVM application and middleware metrics using JMX metric gathering.", "jmx", ["Metrics"], "Host-local receiver", ["Agent"], "Stable", "Guided template", endpointFields),

  // Databases, storage and search
  s("postgresql", "PostgreSQL", "Databases & storage", "Database, table, index, replication, connection and transaction metrics.", "postgresql", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("mysql", "MySQL / MariaDB", "Databases & storage", "Connections, buffer pool, query, replication, table and database metrics.", "mysql", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("sqlserver", "Microsoft SQL Server", "Databases & storage", "SQL Server performance, database, lock, transaction and resource metrics.", "sqlserver", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("oracle", "Oracle Database", "Databases & storage", "Oracle sessions, tablespace, waits, resource and performance metrics.", "oracle", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Beta", "Starter config", endpointFields),
  s("mongodb", "MongoDB", "Databases & storage", "MongoDB operation, cache, connection, database, replication and storage metrics.", "mongodb", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("redis", "Redis", "Databases & storage", "Memory, clients, commands, keyspace, replication and persistence telemetry.", "redis", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("elasticsearch", "Elasticsearch", "Databases & storage", "Cluster, node, index, shard, JVM, search and indexing metrics.", "elasticsearch", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("opensearch", "OpenSearch", "Databases & storage", "OpenSearch cluster, node, index and JVM metrics through compatible APIs.", "elasticsearch", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("cassandra", "Apache Cassandra", "Databases & storage", "Cassandra JVM and database telemetry using curated JMX mappings.", "jmx", ["Metrics"], "Database receiver", ["Agent"], "Stable", "Guided template", endpointFields),
  s("couchdb", "Apache CouchDB", "Databases & storage", "Database, request, response, replication and runtime metrics.", "couchdb", ["Metrics"], "Database receiver", ["Agent", "Gateway"], "Beta", "Starter config", endpointFields),
  s("clickhouse", "ClickHouse", "Databases & storage", "Server, query, merge, storage and replication telemetry through Prometheus and logs.", "prometheus + filelog", ["Metrics", "Logs"], "Prometheus scrape", ["Agent", "Gateway"], "Stable", "Guided template", scrapeFields),
  s("snowflake", "Snowflake", "Databases & storage", "Warehouse, query, credit, storage and usage telemetry from Snowflake account views.", "snowflake", ["Metrics", "Events"], "Database receiver", ["Gateway"], "Beta", "Starter config", endpointFields),
  s("memcached", "Memcached", "Databases & storage", "Cache hit, item, memory, connection and command telemetry.", "memcached", ["Metrics"], "Database receiver", ["Agent"], "Beta", "Starter config", endpointFields),

  // Messaging and streaming
  s("kafka", "Apache Kafka", "Messaging & streaming", "Broker and cluster metrics, consumer lag, application spans and server logs.", "kafkametrics + jmx + filelog", ["Metrics", "Logs", "Traces"], "Host-local receiver", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("kafka-logs", "Kafka topic logs", "Messaging & streaming", "Consume structured log or event records directly from selected Kafka topics.", "kafka", ["Logs", "Events"], "Streaming", ["Gateway"], "Stable", "Starter config", endpointFields),
  s("rabbitmq", "RabbitMQ", "Messaging & streaming", "Node, queue, exchange, connection and message-rate telemetry.", "rabbitmq", ["Metrics", "Logs", "Traces"], "Host-local receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("activemq", "Apache ActiveMQ", "Messaging & streaming", "Broker, queue, topic, connection and JVM metrics through JMX.", "jmx", ["Metrics"], "Host-local receiver", ["Agent"], "Stable", "Guided template", endpointFields),
  s("nats", "NATS", "Messaging & streaming", "Server, route, gateway, subscription and JetStream telemetry.", "prometheus", ["Metrics", "Logs", "Traces"], "Prometheus scrape", ["Agent", "Gateway"], "Stable", "Guided template", scrapeFields),
  s("pulsar", "Apache Pulsar", "Messaging & streaming", "Broker, bookie, topic, subscription and backlog metrics.", "prometheus", ["Metrics", "Logs"], "Prometheus scrape", ["Agent", "Gateway"], "Stable", "Guided template", scrapeFields),
  s("aws-sqs", "Amazon SQS", "Messaging & streaming", "Queue depth, age, throughput, delay and dead-letter metrics from CloudWatch.", "awscloudwatch", ["Metrics", "Inventory"], "Cloud API", ["Cloud", "Gateway"], "Stable", "Guided template", cloudFields),
  s("azure-service-bus", "Azure Service Bus", "Messaging & streaming", "Queue, topic, subscription, error and throughput metrics from Azure Monitor.", "azuremonitor", ["Metrics", "Inventory"], "Cloud API", ["Cloud", "Gateway"], "Stable", "Guided template", cloudFields),

  // Web, proxies and service mesh
  s("nginx", "NGINX", "Web, proxy & service mesh", "Connections, requests, response classes and server logs.", "nginx + filelog", ["Metrics", "Logs"], "Host-local receiver", ["Agent"], "Stable", "Guided template", endpointFields),
  s("apache", "Apache HTTP Server", "Web, proxy & service mesh", "Workers, requests, traffic and access/error log telemetry.", "apache + filelog", ["Metrics", "Logs"], "Host-local receiver", ["Agent"], "Stable", "Guided template", endpointFields),
  s("haproxy", "HAProxy", "Web, proxy & service mesh", "Frontend, backend, server, session and traffic metrics with access logs.", "haproxy + filelog", ["Metrics", "Logs"], "Host-local receiver", ["Agent"], "Stable", "Guided template", endpointFields),
  s("iis", "Microsoft IIS", "Web, proxy & service mesh", "Request, connection, application pool and Windows access log telemetry.", "iis + windowseventlog", ["Metrics", "Logs"], "Host-local receiver", ["Agent"], "Stable", "Guided template", endpointFields),
  s("envoy", "Envoy Proxy", "Web, proxy & service mesh", "Proxy, cluster, listener, connection and request metrics plus access logs.", "prometheus + filelog", ["Metrics", "Logs", "Traces"], "Prometheus scrape", ["Agent", "Gateway"], "Stable", "Guided template", scrapeFields),
  s("istio", "Istio", "Web, proxy & service mesh", "Mesh traffic, control-plane, proxy, service and workload telemetry.", "prometheus + filelog", ["Metrics", "Logs", "Traces"], "Prometheus scrape", ["Agent", "Cluster"], "Stable", "Guided template", scrapeFields),
  s("caddy", "Caddy", "Web, proxy & service mesh", "Prometheus metrics and structured access logs from Caddy servers.", "prometheus + filelog", ["Metrics", "Logs"], "Prometheus scrape", ["Agent"], "Stable", "Guided template", scrapeFields),

  // Logs, security and events
  s("filelog", "File logs", "Logs, security & events", "Tail, parse, multiline, route and enrich application or system log files.", "filelog", ["Logs"], "File / log receiver", ["Agent"], "Stable", "Starter config", fileFields),
  s("syslog", "Syslog", "Logs, security & events", "Receive RFC 3164 and RFC 5424 syslog over TCP or UDP.", "syslog", ["Logs", "Events"], "Protocol receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("fluent-forward", "Fluent Forward", "Logs, security & events", "Receive logs from Fluent Bit, Fluentd and compatible forward-protocol clients.", "fluentforward", ["Logs"], "Protocol receiver", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("splunk-hec", "Splunk HEC", "Logs, security & events", "Receive Splunk HTTP Event Collector events and metrics during pipeline migration.", "splunk_hec", ["Logs", "Metrics", "Events"], "Protocol receiver", ["Gateway"], "Stable", "Starter config", endpointFields),
  s("webhook", "Generic webhook", "Logs, security & events", "Turn authenticated JSON webhook payloads into structured events and logs.", "webhookevent", ["Logs", "Events"], "Protocol receiver", ["Gateway"], "Beta", "Starter config", endpointFields),
  s("auditd", "Linux audit logs", "Logs, security & events", "Parse Linux audit framework events with host and process context.", "filelog", ["Logs", "Events"], "File / log receiver", ["Agent"], "Stable", "Guided template", fileFields),
  s("falco", "Falco", "Logs, security & events", "Receive Falco runtime security findings through OTLP, syslog or webhook output.", "otlp + syslog", ["Logs", "Events"], "Protocol receiver", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("s3-events", "Object storage archives", "Logs, security & events", "Ingest archived log objects from S3-compatible storage and event notifications.", "awss3", ["Logs", "Events"], "Cloud API", ["Cloud", "Gateway"], "Beta", "Guided template", cloudFields),

  // Network and synthetic monitoring
  s("snmp", "SNMP devices", "Network & synthetics", "Poll routers, switches, appliances and device MIB metrics using SNMP.", "snmp", ["Metrics", "Inventory"], "Host-local receiver", ["Agent"], "Beta", "Starter config", endpointFields),
  s("netflow", "NetFlow", "Network & synthetics", "Receive NetFlow records and aggregate network traffic conversations.", "netflow", ["Logs", "Metrics", "Events"], "Protocol receiver", ["Agent", "Gateway"], "Preview", "Preview", endpointFields),
  s("sflow", "sFlow", "Network & synthetics", "Receive sFlow samples through the NetFlow receiver's sFlow mode.", "netflow/sflow", ["Logs", "Events"], "Protocol receiver", ["Agent", "Gateway"], "Preview", "Preview", endpointFields),
  s("http-check", "HTTP endpoint", "Network & synthetics", "Check HTTP status, latency, body assertions, redirects and certificate state.", "httpcheck", ["Checks", "Metrics"], "Synthetic probe", ["Agent", "Gateway"], "Stable", "Starter config", endpointFields),
  s("tcp-check", "TCP endpoint", "Network & synthetics", "Check TCP connectivity and connection latency from controlled locations.", "tcpcheck", ["Checks", "Metrics"], "Synthetic probe", ["Agent"], "Beta", "Starter config", endpointFields),
  s("dns-check", "DNS", "Network & synthetics", "Measure resolution, validate answer records and monitor authoritative DNS behavior.", "nexus-dnscheck", ["Checks", "Metrics"], "Synthetic probe", ["Agent"], "Stable", "Guided template", endpointFields),
  s("tls-check", "TLS certificate", "Network & synthetics", "Track certificate validity, expiry, chain and handshake duration.", "nexus-tlscheck", ["Checks", "Metrics"], "Synthetic probe", ["Agent"], "Stable", "Guided template", endpointFields),
  s("icmp-check", "ICMP / ping", "Network & synthetics", "Measure reachability, latency and packet loss from private or public locations.", "nexus-icmpcheck", ["Checks", "Metrics"], "Synthetic probe", ["Agent"], "Stable", "Guided template", endpointFields),
  s("website", "Browser website test", "Network & synthetics", "Run browser journeys, assertions, screenshots and frontend performance checks.", "nexus-browsercheck", ["Checks", "RUM", "Events"], "Synthetic probe", ["Agent"], "Stable", "Guided template", endpointFields),

  // Developer systems and deployment events
  s("gitlab", "GitLab", "Developer systems", "Pipeline, job, runner and deployment telemetry through Prometheus and webhooks.", "prometheus + webhookevent", ["Metrics", "Events", "Logs"], "Prometheus scrape", ["Agent", "Gateway"], "Stable", "Guided template", scrapeFields),
  s("jenkins", "Jenkins", "Developer systems", "Controller, executor, queue, build and deployment telemetry.", "prometheus + webhookevent", ["Metrics", "Events", "Logs"], "Prometheus scrape", ["Agent", "Gateway"], "Stable", "Guided template", scrapeFields),
  s("argocd", "Argo CD", "Developer systems", "Application sync, health, reconciliation and deployment events.", "prometheus + webhookevent", ["Metrics", "Events", "Inventory"], "Prometheus scrape", ["Cluster", "Gateway"], "Stable", "Guided template", scrapeFields),
  s("deployment-events", "Deployment events API", "Developer systems", "Send normalized deployment, release, feature-flag and change events.", "webhookevent", ["Events"], "Protocol receiver", ["Application", "Gateway"], "Stable", "Guided template", endpointFields),

  // Experience and profiling
  s("browser-rum", "Browser RUM", "Experience & profiling", "Core Web Vitals, views, actions, resources, errors and trace correlation.", "nexus-rum", ["RUM", "Events", "Traces"], "Browser / mobile SDK", ["Application", "Gateway"], "Stable", "Guided template"),
  s("mobile-rum", "Mobile RUM", "Experience & profiling", "Mobile sessions, crashes, network requests and application responsiveness.", "nexus-rum", ["RUM", "Events", "Traces"], "Browser / mobile SDK", ["Application", "Gateway"], "Beta", "Guided template"),
  s("otlp-profiles", "OTLP profiles", "Experience & profiling", "Receive OpenTelemetry profiles as the signal and ecosystem mature.", "otlp", ["Profiles"], "Protocol receiver", ["Agent", "Gateway"], "Preview", "Preview"),
  s("pprof", "pprof", "Experience & profiling", "Collect Go and compatible runtime profiles from pprof endpoints.", "pprof", ["Profiles"], "Host-local receiver", ["Agent"], "Beta", "Guided template", endpointFields),
  s("ebpf-profiling", "eBPF profiling", "Experience & profiling", "Low-overhead host-wide CPU profiling with process and container identity.", "nexus-ebpf-profiler", ["Profiles", "Metrics"], "Host-local receiver", ["Agent"], "Preview", "Preview"),

  // Migration and extension paths
  s("datadog-migration", "Datadog / DDOT bridge", "Migration & custom", "Dual-ship from DDOT or a Collector, validate parity, then move alerts and dashboards deliberately.", "otlp + datadog", ["Traces", "Metrics", "Logs"], "Vendor bridge", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("signoz-migration", "SigNoz bridge", "Migration & custom", "Reuse existing OTel SDKs and Collectors, then dual-ship OTLP during migration.", "otlp", ["Traces", "Metrics", "Logs"], "Vendor bridge", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("dynatrace-migration", "Dynatrace bridge", "Migration & custom", "Dual-ship standard OTLP while retaining existing Dynatrace collection during validation.", "otlp", ["Traces", "Metrics", "Logs"], "Vendor bridge", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("grafana-alloy", "Grafana Alloy", "Migration & custom", "Export OTLP from existing Alloy pipelines without replacing the collector runtime.", "otlp", ["Traces", "Metrics", "Logs", "Profiles"], "Vendor bridge", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("splunk-otel", "Splunk OTel Collector", "Migration & custom", "Add a standard OTLP exporter to existing Splunk OTel Collector pipelines.", "otlp", ["Traces", "Metrics", "Logs"], "Vendor bridge", ["Agent", "Gateway"], "Stable", "Guided template", endpointFields),
  s("custom-receiver", "Custom Collector receiver", "Migration & custom", "Import any supported Collector component or paste standard OTel YAML without waiting for a catalog tile.", "custom", ["Traces", "Metrics", "Logs", "Profiles", "Events"], "Custom", ["Agent", "Gateway", "Cluster"], "Stable", "Starter config"),
  s("custom-webhook", "Custom JSON source", "Migration & custom", "Map authenticated JSON payloads into logs, events or metric records.", "webhookevent", ["Logs", "Events", "Metrics"], "Custom", ["Gateway"], "Beta", "Guided template", endpointFields),
];

export const sourceCategories = Array.from(new Set(otelSourceCatalog.map((source) => source.category)));
export const sourceSignals: OtelSignal[] = ["Traces", "Metrics", "Logs", "Profiles", "Events", "Inventory", "RUM", "Checks"];

function envName(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").toUpperCase();
}

export function fieldsForSource(source: SourceDefinition): SourceField[] {
  if (source.fields) return source.fields;
  if (source.collectionType === "SDK / OTLP" || source.collectionType === "Browser / mobile SDK") {
    return [
      { key: "service", label: "Service name", placeholder: "checkout-api" },
      { key: "environment", label: "Environment", placeholder: "production" },
    ];
  }
  if (source.collectionType === "Custom") {
    return [{ key: "component", label: "Collector component", placeholder: "receiver-name" }];
  }
  return [];
}

export function generateSourceConfig(source: SourceDefinition, values: Record<string, string>) {
  const instance = source.id.replace(/[^a-z0-9_-]/gi, "_");
  const firstReceiver = source.receiver.split(" + ")[0];
  const receiverType = firstReceiver.split("/")[0];
  const receiverId = firstReceiver === "netflow/sflow" ? firstReceiver : `${receiverType}/${instance}`;
  const endpoint = values.endpoint || `\${env:${envName(source.id)}_ENDPOINT}`;
  const credential = values.password || values.credential || `\${env:${envName(source.id)}_TOKEN}`;

  if (source.collectionType === "SDK / OTLP" || source.collectionType === "Browser / mobile SDK") {
    const service = values.service || "my-service";
    const environment = values.environment || "production";
    return `# Configure these values in the ${source.name} application runtime\nOTEL_SERVICE_NAME=${service}\nOTEL_RESOURCE_ATTRIBUTES=deployment.environment.name=${environment},team.name=my-team\nOTEL_EXPORTER_OTLP_ENDPOINT=\${env:NEXUSOBSERVE_OTLP_ENDPOINT}\nOTEL_EXPORTER_OTLP_HEADERS=authorization=Bearer%20\${env:NEXUSOBSERVE_TOKEN}\nOTEL_TRACES_EXPORTER=otlp\nOTEL_METRICS_EXPORTER=otlp\nOTEL_LOGS_EXPORTER=otlp`;
  }

  let body = `  ${receiverId}:`;
  if (source.collectionType === "Prometheus scrape") {
    const target = endpoint.replace(/^https?:\/\//, "").split("/")[0];
    body += `\n    config:\n      scrape_configs:\n        - job_name: ${instance}\n          scrape_interval: ${values.interval || "30s"}\n          static_configs:\n            - targets: [\"${endpoint.replace(/^https?:\/\//, "")}\"]`;
    body = body.replace(endpoint.replace(/^https?:\/\//, ""), target);
  } else if (source.collectionType === "File / log receiver") {
    body += `\n    include: [${values.path || "/var/log/application/*.log"}]\n    start_at: end\n    include_file_path: true`;
  } else if (receiverType === "hostmetrics") {
    body += `\n    collection_interval: 30s\n    scrapers:\n      cpu: {}\n      memory: {}\n      disk: {}\n      filesystem: {}\n      network: {}\n      process: {}`;
  } else if (source.collectionType === "Cloud API") {
    body += `\n    collection_interval: 60s\n    region: ${values.region || "us-east-1"}\n    credential_ref: ${credential}`;
  } else if (source.collectionType === "Custom") {
    body = `  ${values.component || "custom"}/${instance}:\n    # Paste component-specific standard OTel settings here`;
  } else if (receiverType === "otlp") {
    body += `\n    protocols:\n      grpc:\n        endpoint: 0.0.0.0:4317\n      http:\n        endpoint: 0.0.0.0:4318`;
  } else if (receiverType === "netflow") {
    body += `\n    scheme: ${firstReceiver.includes("sflow") ? "sflow" : "netflow"}\n    port: ${firstReceiver.includes("sflow") ? "6343" : "2055"}`;
  } else if (source.collectionType === "Database receiver") {
    body += `\n    endpoint: ${endpoint}\n    collection_interval: 30s`;
    if (values.username) body += `\n    username: ${values.username}`;
    if (values.password) body += `\n    password: ${credential}`;
  } else {
    body += `\n    endpoint: ${endpoint}`;
    if (values.username) body += `\n    username: ${values.username}`;
    if (values.password) body += `\n    password: ${credential}`;
  }

  const primarySignal = source.signals.find((signal) =>
    ["Traces", "Metrics", "Logs", "Profiles"].includes(signal),
  ) || (source.signals.includes("Checks") ? "Metrics" : "Logs");
  const pipeline = primarySignal.toLowerCase();
  const pipelines = `    ${pipeline}/${instance}:\n      receivers: [${receiverId}]\n      processors: [memory_limiter, resource/${instance}, batch]\n      exporters: [otlphttp/nexusobserve]`;

  return `receivers:\n${body}\n\nprocessors:\n  memory_limiter:\n    check_interval: 1s\n    limit_mib: 512\n  resource/${instance}:\n    attributes:\n      - key: nexusobserve.source\n        value: ${source.id}\n        action: upsert\n  batch: {}\n\nexporters:\n  otlphttp/nexusobserve:\n    endpoint: \${env:NEXUSOBSERVE_OTLP_ENDPOINT}\n    headers:\n      authorization: Bearer \${env:NEXUSOBSERVE_TOKEN}\n\nservice:\n  pipelines:\n${pipelines || `    logs/${instance}:\n      receivers: [${firstReceiver}/${instance}]\n      processors: [memory_limiter, resource/${instance}, batch]\n      exporters: [otlphttp/nexusobserve]`}`;
}
