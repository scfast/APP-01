"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      setMessage("Account created. Go to dashboard.");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Sign up</h1>
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
          Create account
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-emerald-300 text-sm">{message}</p>}
      </form>
      <p className="text-slate-300 text-sm">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
