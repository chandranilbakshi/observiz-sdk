# @observiz/sdk

Plug-and-play OpenTelemetry observability for Node and Bun APIs. One function call adds distributed tracing, structured logging, and metrics to any API — with zero changes to your business logic.

Works with the [Observiz self-hosted stack](https://github.com/chandranilbakshi/observiz) or any OpenTelemetry-compatible backend (Grafana Cloud, Jaeger, Tempo, etc).

## Packages

This is a monorepo. Install only what you need:

| Package | Description |
|---|---|
| `@observiz/sdk` | Umbrella package — installs all three below |
| `@observiz/traces` | Distributed tracing via OpenTelemetry |
| `@observiz/logs` | Structured logging via Winston + OTel |
| `@observiz/metrics` | Metrics via OpenTelemetry MeterProvider |
| `@observiz/core` | Shared internals (not installed directly) |

## Quickstart

**1. Set up the observability stack:**

Follow the setup guide at [observiz](https://github.com/chandranilbakshi/observiz) to run Grafana, Tempo, Loki, and Prometheus locally with one command.

**2. Install the SDK:**

```bash
npm install @observiz/sdk
```

**3. Add one line to your entry point — before any other imports:**

```typescript
import { initObserviz } from "@observiz/sdk"

initObserviz({ serviceName: "my-api" })

// rest of your app below
import express from "express"
const app = express()
```

**4. Set the collector URL:**

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

That's it. Traces, logs, and metrics are now flowing to your Grafana dashboard.

## Configuration

```typescript
initObserviz({
  serviceName: "my-api",        // required
  serviceVersion: "1.0.0",      // optional, defaults to "0.0.1"
  environment: "production",    // optional, defaults to NODE_ENV
  collectorUrl: "http://localhost:4317", // optional, defaults to OTEL_EXPORTER_OTLP_ENDPOINT
})
```

## Logging

```typescript
import { getLogger } from "@observiz/sdk"

const logger = getLogger()

logger.info("order created", { orderId: "123" })
logger.error("payment failed", { error: err.message })
```

## Custom metrics

```typescript
import { getMeter } from "@observiz/sdk"

const meter = getMeter("my-api")

const requestCounter = meter.createCounter("http_requests_total", {
  description: "Total HTTP requests",
})
requestCounter.add(1, { method: "GET", route: "/orders" })
```

## Manual spans

```typescript
import { trace } from "@opentelemetry/api"

const tracer = trace.getTracer("my-api")
const span = tracer.startSpan("db.query.orders")

try {
  span.setAttributes({ "db.system": "postgresql" })
} catch (err) {
  span.recordException(err)
} finally {
  span.end()
}
```

## Selective installation

**Tracing only:**
```bash
npm install @observiz/traces
```
```typescript
import { initTraces } from "@observiz/traces"
initTraces({ serviceName: "my-api" })
```

**Logging only:**
```bash
npm install @observiz/logs
```
```typescript
import { initLogs, getLogger } from "@observiz/logs"
initLogs({ serviceName: "my-api" })
const logger = getLogger()
```

**Metrics only:**
```bash
npm install @observiz/metrics
```
```typescript
import { initMetrics, getMeter } from "@observiz/metrics"
initMetrics({ serviceName: "my-api" })
const meter = getMeter("my-api")
```

## Auto-instrumentation

HTTP requests, database calls, and errors are instrumented automatically with no extra code. Health check endpoints (`/health`, `/healthz`, `/ping`) are ignored by default.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTel Collector URL | `http://localhost:4317` |
| `OTEL_SERVICE_NAME` | Service name (overrides config) | — |
| `NODE_ENV` | Deployment environment | `development` |
| `LOG_LEVEL` | Winston log level | `info` |

## License

MIT
