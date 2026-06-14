# @observiz/metrics

Metrics for Node and Bun APIs via OpenTelemetry. Ships to Prometheus and visualized in Grafana. Part of the [Observiz](https://github.com/chandranilbakshi/observiz-sdk) monorepo.

## Install

```bash
npm install @observiz/metrics
```

## Usage

```typescript
import { initMetrics, getMeter } from "@observiz/metrics"

initMetrics({ serviceName: "my-api" })

const meter = getMeter("my-api")

// Counter — increments only
const requestCounter = meter.createCounter("http_requests_total", {
  description: "Total HTTP requests",
})
requestCounter.add(1, { method: "GET", route: "/orders" })

// Histogram — for latency measurements
const latencyHistogram = meter.createHistogram("http_request_duration_ms", {
  description: "HTTP request duration in milliseconds",
})
latencyHistogram.record(42, { route: "/orders" })

// Observable gauge — for values that fluctuate
const activeConnections = meter.createObservableGauge("active_connections", {
  description: "Number of active connections",
})
let connections = 0
activeConnections.addCallback((result) => result.observe(connections))
```

## Configuration

```typescript
initMetrics({
  serviceName: "my-api",        // required
  serviceVersion: "1.0.0",      // optional
  environment: "production",    // optional, defaults to NODE_ENV
  collectorUrl: "http://localhost:4317", // optional, defaults to OTEL_EXPORTER_OTLP_ENDPOINT
})
```

## Export interval

Metrics are exported every 10 seconds by default. This is not currently configurable but will be in a future release.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTel Collector URL | `http://localhost:4317` |
| `NODE_ENV` | Deployment environment | `development` |

## Want everything in one package?

```bash
npm install @observiz/sdk
```

See the full documentation at [@observiz/sdk](https://www.npmjs.com/package/@observiz/sdk).

## License

MIT
