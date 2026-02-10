"use client";

import { useEffect, useState } from "react";

type LabConfig = {
  reflectedXss: boolean;
  openRedirect: boolean;
  insecureCookies: boolean;
  verboseErrors: boolean;
  missingSecurityHeaders: boolean;
  verboseServerHeader: boolean;
  idorUserLookup: boolean;
  nosqlInjection: boolean;
  noCsrf: boolean;
};

const flagMeta: Array<{
  key: keyof LabConfig;
  label: string;
  description: string;
}> = [
  {
    key: "reflectedXss",
    label: "Reflected output",
    description: "Echo raw input in HTML responses."
  },
  {
    key: "openRedirect",
    label: "Open redirect",
    description: "Allow redirects to arbitrary targets."
  },
  {
    key: "insecureCookies",
    label: "Weak cookies",
    description: "Set cookies without HttpOnly or Secure."
  },
  {
    key: "missingSecurityHeaders",
    label: "Missing security headers",
    description: "Omit CSP, HSTS, and related headers."
  },
  {
    key: "verboseServerHeader",
    label: "Verbose server headers",
    description: "Expose Server and X-Powered-By."
  },
  {
    key: "idorUserLookup",
    label: "IDOR user lookup",
    description: "Allow user lookup without ownership checks."
  },
  {
    key: "nosqlInjection",
    label: "NoSQL injection",
    description: "Accept raw JSON filters for searches."
  },
  {
    key: "noCsrf",
    label: "No CSRF check",
    description: "Accept state-changing form posts without validation."
  },
  {
    key: "verboseErrors",
    label: "Verbose errors",
    description: "Return full error details in responses."
  }
];

export default function LabClient() {
  const [config, setConfig] = useState<LabConfig | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    setError(null);
    const res = await fetch("/api/lab/config");
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Failed to load lab config");
      return;
    }
    setConfig(data.config);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const updateFlag = async (key: keyof LabConfig, value: boolean) => {
    setSaving(key);
    setError(null);
    const res = await fetch("/api/lab/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Failed to update flag");
      setSaving(null);
      return;
    }
    setConfig(data.config);
    setSaving(null);
  };

  const resetFlags = async () => {
    setSaving("reset");
    const res = await fetch("/api/lab/config/reset", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setConfig(data.config);
    } else {
      setError(data?.error || "Failed to reset flags");
    }
    setSaving(null);
  };

  if (!config) {
    return <p className="text-sm text-slate-300">Loading lab config...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Vulnerability toggles</h2>
            <p className="text-sm text-slate-300">
              Turn flaws on or off, then re-run ZAP to compare alerts.
            </p>
          </div>
          <button className="button-muted" onClick={resetFlags} disabled={saving === "reset"}>
            Reset defaults
          </button>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {flagMeta.map((flag) => (
            <label key={flag.key} className="card space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{flag.label}</p>
                  <p className="text-xs text-slate-300">{flag.description}</p>
                </div>
                <input
                  className="h-5 w-5"
                  type="checkbox"
                  checked={config[flag.key]}
                  onChange={(e) => updateFlag(flag.key, e.target.checked)}
                  disabled={saving === flag.key}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">Scan targets</h2>
        <p className="text-sm text-slate-300">
          Use these paths as ZAP targets. Keep scans local-only.
        </p>
        <ul className="text-sm text-slate-200 space-y-2">
          <li>/api/lab/reflect?q=hello</li>
          <li>/api/lab/redirect?to=/dashboard</li>
          <li>/api/lab/cookie</li>
          <li>/api/lab/headers</li>
          <li>/api/lab/user?uid=YOUR_UID</li>
          <li>/api/lab/search?q=report</li>
          <li>/lab/forms</li>
        </ul>
      </div>
    </div>
  );
}
