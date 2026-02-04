"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetRequestPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Request failed");
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <form onSubmit={onSubmit} className="card space-y-3">
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="button" type="submit">
          Send reset link
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
      {result && (
        <div className="card space-y-2 text-sm">
          <p className="text-emerald-300">Reset link generated.</p>
          <p className="text-slate-300">Token: {result.token}</p>
          <Link className="text-cyan-400" href={`/reset/${result.token}`}>
            Continue to reset
          </Link>
        </div>
      )}
      <p className="text-slate-300 text-sm">
        <Link href="/login">Back to login</Link>
      </p>
    </div>
  );
}
