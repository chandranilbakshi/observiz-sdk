# @observiz/traces

Distributed tracing for Node and Bun APIs via OpenTelemetry. Part of the [Observiz](https://github.com/chandranilbakshi/observiz-sdk) monorepo.

## Install

```bash
npm install @observiz/traces
```

## Usage

Add this before any other imports in your entry point:

```typescript
import { initTraces } from "@observiz/traces"

initTraces({ serviceName: "my-api" })
```

## Configuration

```typescript
initTraces({
  serviceName: "my-api",        // required
  serviceVersion: "1.0.0",      // optional
  environment: "production",    // optional, defaults to NODE_ENV
  collectorUrl: "http://localhost:4317", // optional, defaults to OTEL_EXPORTER_OTLP_ENDPOINT
})
```

## What gets traced automatically

- Incoming HTTP requests
- Outgoing HTTP calls
- Database queries (pg, mysql2, mongodb, redis)
- DNS lookups
- Health check endpoints (`/health`, `/healthz`, `/ping`) are ignored by default

## Manual spans

```typescript
import { trace } from "@opentelemetry/api"

const tracer = trace.getTracer("my-api")
const span = tracer.startSpan("db.query.orders")

try {
  // your code
  span.setAttributes({ "db.system": "postgresql" })
} catch (err) {
  span.recordException(err)
} finally {
  span.end()
}
```

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTel Collector URL | `http://localhost:4317` |
| `OTEL_SERVICE_NAME` | Service name | — |
| `NODE_ENV` | Deployment environment | `development` |

## Want everything in one package?

```bash
npm install @observiz/sdk
```

See the full documentation at [@observiz/sdk](https://www.npmjs.com/package/@observiz/sdk).

## License

MIT
