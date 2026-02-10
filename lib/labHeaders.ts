import { LabConfig } from "@/lib/labConfig";

export function buildLabHeaders(
  config: LabConfig,
  extra: HeadersInit = {}
): Headers {
  const headers = new Headers(extra);
  if (!config.missingSecurityHeaders) {
    headers.set("Content-Security-Policy", "default-src 'self'");
    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "no-referrer");
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  }
  if (config.verboseServerHeader) {
    headers.set("Server", "Dockyard-Lab/0.1");
    headers.set("X-Powered-By", "Next.js");
  }
  return headers;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
