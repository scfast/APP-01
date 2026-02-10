"use client";

import { useEffect, useState } from "react";

export default function GuardrailsClient() {
  const [host, setHost] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.hostname);
      setProtocol(window.location.protocol);
    }
  }, []);

  const isLocal = host === "localhost" || host === "127.0.0.1";

  return (
    <div className="card space-y-3">
      <h2 className="text-lg font-semibold">Local-only reminder</h2>
      <p className="text-sm text-slate-300">
        This lab must stay on localhost or an isolated training network. Do not
        expose it to the public internet.
      </p>
      <div className="text-sm">
        <p>Host: {host || "checking..."}</p>
        <p>Protocol: {protocol || "checking..."}</p>
        <p>
          Status: {host ? (isLocal ? "Local" : "Not local") : "Checking"}
        </p>
      </div>
    </div>
  );
}
