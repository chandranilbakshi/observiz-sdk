import { NodeSDK } from "@opentelemetry/sdk-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { credentials } from "@grpc/grpc-js"
import { createResource, resolveCollectorUrl } from "@observiz/core"
import type { ObservizConfig } from "@observiz/core"

let sdk: NodeSDK | null = null

export function initTraces(config: ObservizConfig): void {
  if (sdk) return // prevent double init

  const collectorUrl = resolveCollectorUrl(config)

  sdk = new NodeSDK({
    resource: createResource(config),
    traceExporter: new OTLPTraceExporter({
      url: collectorUrl,
      credentials: credentials.createInsecure(),
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": { enabled: false },
        "@opentelemetry/instrumentation-http": {
          ignoreIncomingRequestHook: (req) => {
            // ignore health check endpoints by convention
            const url = (req as any).url ?? ""
            return url === "/health" || url === "/healthz" || url === "/ping"
          },
        },
      }),
    ],
  })

  sdk.start()

  process.on("SIGTERM", () => sdk?.shutdown())
  process.on("SIGINT",  () => sdk?.shutdown())
}
