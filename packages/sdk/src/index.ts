import { initTraces } from "@observiz/traces"
import { initLogs, getLogger } from "@observiz/logs"
import { initMetrics, getMeter } from "@observiz/metrics"
import type { ObservizConfig } from "@observiz/core"

export type { ObservizConfig }
export { initTraces, initLogs, getLogger, initMetrics, getMeter }

export function initObserviz(config: ObservizConfig): void {
  initTraces(config)
  initLogs(config)
  initMetrics(config)
}
