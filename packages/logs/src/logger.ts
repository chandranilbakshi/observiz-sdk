import winston from "winston"
import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"
import { logs } from "@opentelemetry/api-logs"
import { credentials } from "@grpc/grpc-js"
import { createResource, resolveCollectorUrl } from "@observiz/core"
import type { ObservizConfig } from "@observiz/core"

let loggerProvider: LoggerProvider | null = null
let _logger: winston.Logger | null = null

export function initLogs(config: ObservizConfig): void {
  if (loggerProvider) return // prevent double init

  const collectorUrl = resolveCollectorUrl(config)

  loggerProvider = new LoggerProvider({ resource: createResource(config) })

  loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: collectorUrl,
        credentials: credentials.createInsecure(),
      })
    )
  )

  logs.setGlobalLoggerProvider(loggerProvider)

  process.on("SIGTERM", () => loggerProvider?.shutdown())
  process.on("SIGINT",  () => loggerProvider?.shutdown())
}

export function getLogger(config?: ObservizConfig): winston.Logger {
  if (_logger) return _logger

  if (config) initLogs(config)

  _logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new OpenTelemetryTransportV3(),
    ],
  })

  return _logger
}
