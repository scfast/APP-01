import Link from "next/link";
import LabClient from "@/app/lab/LabClient";

export default function LabPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
            Training Lab
          </p>
          <h1 className="text-3xl font-semibold">ZAP Practice Console</h1>
        </div>
        <div className="flex gap-2">
          <Link className="button-muted" href="/lab/guardrails">
            Guardrails
          </Link>
          <Link className="button-muted" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">What this does</h2>
        <p className="text-sm text-slate-300">
          This area exposes intentionally insecure endpoints designed to
          generate OWASP Top 10 signals in ZAP. Toggle flaws on/off to observe
          how alerts change after re-scanning.
        </p>
      </div>

      <LabClient />
    </div>
  );
}
