type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function serializeError(err: unknown): LogContext | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  return { value: String(err) };
}

function write(level: LogLevel, message: string, context: LogContext = {}): void {
  const { err, ...rest } = context;
  const entry = {
    level,
    ts: new Date().toISOString(),
    msg: message,
    ...rest,
    ...(err !== undefined ? { err: serializeError(err) } : {}),
  };

  const line = JSON.stringify(entry);
  switch (level) {
    case "debug":
    case "info":
      if (process.env.NODE_ENV !== "production") console.log(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    write("debug", message, context);
  },
  info(message: string, context?: LogContext) {
    write("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    write("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    write("error", message, context);
  },
};
