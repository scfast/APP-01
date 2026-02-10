import { json } from "@/lib/api";
import { LabConfig } from "@/lib/labConfig";

export function labErrorJson(err: any, config: LabConfig, status = 500) {
  const payload: { error: string; stack?: string | null } = {
    error: err?.message || String(err)
  };
  if (config.verboseErrors) {
    payload.stack = err?.stack || null;
  }
  return json(payload, { status });
}
