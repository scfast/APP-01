import Link from "next/link";
import GuardrailsClient from "@/app/lab/guardrails/GuardrailsClient";

export default function GuardrailsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
            Training Guardrails
          </p>
          <h1 className="text-3xl font-semibold">Scope Safety</h1>
        </div>
        <Link className="button-muted" href="/lab">
          Back to lab
        </Link>
      </header>

      <div className="card space-y-2">
        <h2 className="text-lg font-semibold">ZAP scope rules</h2>
        <p className="text-sm text-slate-300">
          Only scan local, staged, or instructor-provided targets. Never scan
          production or public systems without explicit permission.
        </p>
        <p className="text-sm text-slate-300">
          Keep the proxy and scan scope locked to this app’s hostname.
        </p>
      </div>

      <GuardrailsClient />
    </div>
  );
}
