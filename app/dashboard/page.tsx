"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

type FileItem = {
  _id: string;
  filename: string;
  status: string;
  createdAt: string;
  publicUrl?: string;
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const authedFetch = async (input: RequestInfo, init?: RequestInit) => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("idToken") : "";
    const token = user ? await user.getIdToken() : stored || "";
    let url = typeof input === "string" ? input : input.toString();
    if (!token && typeof window !== "undefined") {
      const uid = new URLSearchParams(window.location.search).get("uid");
      if (uid) {
        url += url.includes("?") ? `&uid=${encodeURIComponent(uid)}` : `?uid=${encodeURIComponent(uid)}`;
      }
    }
    return fetch(url, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: token ? `Bearer ${token}` : ""
      }
    });
  };

  const loadFiles = async () => {
    setError(null);
    if (!user) return;
    const res = await authedFetch("/api/files");
    const data = await res.json();
    setFiles(data.files || []);
  };

  useEffect(() => {
    if (!loading) {
      loadFiles();
    }
  }, [loading, user]);

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!file) return;
    const formEl = e.currentTarget as HTMLFormElement;
    const form = new FormData(formEl);
    form.append("file", file);
    try {
      const res = await authedFetch("/api/upload", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setMessage("Uploaded!");
      setFile(null);
      await loadFiles();
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Dockyard</h1>
        <div className="flex gap-2">
          <Link className="button-muted" href="/admin">
            Admin review
          </Link>
          <button className="button-muted" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <form onSubmit={onUpload} className="card space-y-3">
        <h2 className="text-lg font-semibold">Upload PDF</h2>
        <input
          className="input"
          placeholder="Optional storage path (advanced)"
          name="storagePath"
        />
        <textarea
          className="input min-h-[90px]"
          placeholder="Notes (supports HTML)"
          name="description"
        />
        <input
          className="input"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button className="button" type="submit">
          Upload
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-emerald-300 text-sm">{message}</p>}
      </form>

      <div className="card space-y-2">
        <h2 className="text-lg font-semibold">Your files</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id}>
                <td>{f.filename}</td>
                <td>{f.status}</td>
                <td>{new Date(f.createdAt).toLocaleString()}</td>
                <td>
                  <Link className="text-cyan-400" href={`/file/${f._id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
