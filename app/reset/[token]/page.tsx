"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ResetConfirmPage() {
  const params = useParams();
  const token = params?.token as string;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Reset failed");
      setMessage("Password updated. You can log in now.");
    } catch (err: any) {
      setError(err?.message || "Reset failed");
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <form onSubmit={onSubmit} className="card space-y-3">
        <input
          className="input"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">
          Update password
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-emerald-300 text-sm">{message}</p>}
      </form>
      <p className="text-slate-300 text-sm">
        <Link href="/login">Back to login</Link>
      </p>
    </div>
  );
}
