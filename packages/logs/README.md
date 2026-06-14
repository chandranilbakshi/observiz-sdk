# @observiz/logs

Structured logging for Node and Bun APIs via Winston + OpenTelemetry. Logs are automatically shipped to Loki and correlated with traces. Part of the [Observiz](https://github.com/chandranilbakshi/observiz-sdk) monorepo.

## Install

```bash
npm install @observiz/logs
```

## Usage

```typescript
import { initLogs, getLogger } from "@observiz/logs"

initLogs({ serviceName: "my-api" })

const logger = getLogger()

logger.info("order created", { orderId: "123" })
logger.warn("high latency detected", { route: "/orders", ms: 850 })
logger.error("payment failed", { error: err.message })
```

## Configuration

```typescript
initLogs({
  serviceName: "my-api",        // required
  serviceVersion: "1.0.0",      // optional
  environment: "production",    // optional, defaults to NODE_ENV
  collectorUrl: "http://localhost:4317", // optional, defaults to OTEL_EXPORTER_OTLP_ENDPOINT
})
```

## Log levels

Controlled via the `LOG_LEVEL` environment variable:

```bash
LOG_LEVEL=debug   # debug, info, warn, error
```

Default is `info`.

## Trace correlation

If you're also using `@observiz/traces`, logs are automatically correlated with the active trace. In Grafana, clicking a `trace_id` in a log line jumps directly to the full trace in Tempo.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTel Collector URL | `http://localhost:4317` |
| `LOG_LEVEL` | Winston log level | `info` |
| `NODE_ENV` | Deployment environment | `development` |

## Want everything in one package?

```bash
npm install @observiz/sdk
```

See the full documentation at [@observiz/sdk](https://www.npmjs.com/package/@observiz/sdk).

## License

MIT
