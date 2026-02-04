"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

type FileItem = {
  _id: string;
  filename: string;
  ownerEmail: string;
  status: string;
  storagePath?: string;
  publicUrl?: string;
  createdAt: string;
};

export default function AdminPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const authedFetch = async (input: RequestInfo, init?: RequestInit) => {
    const token = user ? await user.getIdToken() : "";
    return fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: token ? `Bearer ${token}` : ""
      }
    });
  };

  const loadRole = async () => {
    if (!user) return;
    const res = await authedFetch("/api/admin/role");
    const data = await res.json();
    setRole(data.role || "user");
  };

  const loadFiles = async () => {
    const res = await authedFetch("/api/admin/files");
    const data = await res.json();
    setFiles(data.files || []);
  };

  const search = async () => {
    const res = await authedFetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setFiles(data.files || []);
  };

  const setStatus = async (id: string, status: string) => {
    await authedFetch(`/api/admin/files/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await loadFiles();
  };

  useEffect(() => {
    if (user) {
      loadRole();
      loadFiles();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="card space-y-2">
        <p>Login required.</p>
        <Link className="button" href="/login">
          Log in
        </Link>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="card space-y-2">
        <h1 className="text-xl font-semibold">Admin review</h1>
        <p className="text-slate-300">
          You are not marked as admin, so this page is hidden in the UI.
        </p>
        <p className="text-slate-400 text-sm">
          (Training note: the API endpoints are still callable.)
        </p>
        <Link className="button-muted" href="/dashboard">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin review</h1>
        <Link className="button-muted" href="/dashboard">
          Back
        </Link>
      </div>

      <div className="card space-y-3">
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Search by email or filename"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button" onClick={search}>
            Search
          </button>
          <button className="button-muted" onClick={loadFiles}>
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>File</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Storage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id}>
                <td>{f.filename}</td>
                <td>{f.ownerEmail}</td>
                <td>{f.status}</td>
                <td className="text-xs text-slate-400">{f.storagePath}</td>
                <td className="space-x-2">
                  <button
                    className="button"
                    onClick={() => setStatus(f._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="button-muted"
                    onClick={() => setStatus(f._id, "pending")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
