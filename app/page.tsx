import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="tracking-widest">DOCKYARD</span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-yellow-400 text-slate-950 font-bold">
            D
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
          <span className="opacity-80">Who We Are</span>
          <span className="opacity-80">Learning Pods</span>
          <span className="opacity-80">Docs Lab</span>
        </nav>
        <Link className="button" href="/signup">
          Connect With Us
        </Link>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
            Training / Insecure
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
            Build Skills That
            <br />
            Outmatch{" "}
            <span className="text-yellow-400">Obsolescence</span>
          </h1>
          <p className="text-slate-300 max-w-xl">
            Dockyard Docs is a security workshop sandbox for learning threat
            modeling, secure SDLC, and vulnerability detection using real-world
            workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="button" href="/signup">
              Create account
            </Link>
            <Link className="button-muted" href="/login">
              Log in
            </Link>
            <Link className="button-muted" href="/lab">
              ZAP practice lab
            </Link>
            <Link className="button-muted" href="/dashboard">
              Go to dashboard
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Internal tag: {process.env.NEXT_PUBLIC_LAB_INTERNAL_TAG}
          </p>
        </div>

        <div className="relative h-80 sm:h-96 lg:h-[440px] rounded-[32px] overflow-hidden border border-slate-800/60">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-slate-950/10 to-yellow-500/60" />
          <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-yellow-400/80 to-orange-600/60 blur-2xl" />
          <div className="absolute right-8 bottom-10 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/80 to-fuchsia-500/60 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="card max-w-xs text-center space-y-2">
              <p className="text-sm text-slate-300">Workshop Mode</p>
              <p className="text-lg font-semibold">
                Observe, exploit, and learn
              </p>
              <Link className="button-muted" href="/admin">
                Admin review
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Threat Modeling</h2>
          <p className="text-slate-300 text-sm">
            Identify weak controls, spoofing risks, and data exposure paths.
          </p>
        </div>
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Secure SDLC</h2>
          <p className="text-slate-300 text-sm">
            Practice review checkpoints with intentionally flawed endpoints.
          </p>
        </div>
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Observability</h2>
          <p className="text-slate-300 text-sm">
            Use devtools to inspect traffic and improper access patterns.
          </p>
        </div>
      </section>
    </main>
  );
}
