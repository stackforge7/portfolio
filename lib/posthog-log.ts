import posthog from "posthog-js";

type LogAttributes = Record<string, string | number | boolean>;

const LOGGER_NAME = "portfolio_posthog_exporter";

export const posthogLog = {
  info(body: string, attributes: LogAttributes = {}) {
    posthog.captureLog({
      level: "info",
      body,
      attributes: {
        "logger.name": LOGGER_NAME,
        ...attributes,
      },
    });
  },
};
