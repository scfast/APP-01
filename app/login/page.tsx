"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      setMessage("Logged in! Go to dashboard.");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Log in</h1>
      <form onSubmit={onSubmit} className="card space-y-3">
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">
          Log in
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-emerald-300 text-sm">{message}</p>}
      </form>
      <p className="text-slate-300 text-sm">
        Need an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
