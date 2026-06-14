import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { metrics } from "@opentelemetry/api"
import { credentials } from "@grpc/grpc-js"
import { createResource, resolveCollectorUrl } from "@observiz/core"
import type { ObservizConfig } from "@observiz/core"

let meterProvider: MeterProvider | null = null

export function initMetrics(config: ObservizConfig): void {
  if (meterProvider) return // prevent double init

  const collectorUrl = resolveCollectorUrl(config)

  meterProvider = new MeterProvider({
    resource: createResource(config),
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: collectorUrl,
          credentials: credentials.createInsecure(),
        }),
        exportIntervalMillis: 10_000,
      }),
    ],
  })

  metrics.setGlobalMeterProvider(meterProvider)

  process.on("SIGTERM", () => meterProvider?.shutdown())
  process.on("SIGINT",  () => meterProvider?.shutdown())
}

/**
 * Get a meter for creating instruments (counters, histograms, gauges).
 * Call initMetrics() before using this.
 */
export function getMeter(name: string) {
  return metrics.getMeter(name)
}
