"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

type FileItem = {
  _id: string;
  filename: string;
  status: string;
  ownerEmail: string;
  publicUrl?: string;
  storagePath?: string;
  createdAt: string;
};

type ShareInfo = {
  token: string;
  expiresAt?: string;
};

export default function FileDetailPage() {
  const params = useParams();
  const fileId = params?.id as string;
  const { user } = useAuth();
  const [file, setFile] = useState<FileItem | null>(null);
  const [share, setShare] = useState<ShareInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const run = async () => {
      const res = await authedFetch(`/api/files/${fileId}`);
      const data = await res.json();
      setFile(data.file || null);
    };
    if (fileId) run();
  }, [fileId]);

  const createShare = async () => {
    setError(null);
    const res = await authedFetch("/api/share/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Failed to create share");
      return;
    }
    setShare(data.share);
  };

  if (!file) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h1 className="text-2xl font-bold">{file.filename}</h1>
        <p className="text-slate-300">Owner: {file.ownerEmail}</p>
        <p className="text-slate-300">Status: {file.status}</p>
        <p className="text-slate-300">Storage path: {file.storagePath}</p>
        <div className="flex gap-3 flex-wrap">
          <a className="button" href={`/api/files/${file._id}/download`}>
            Download
          </a>
          {file.publicUrl && (
            <a className="button-muted" href={file.publicUrl}>
              Public URL
            </a>
          )}
          <Link className="button-muted" href="/dashboard">
            Back
          </Link>
        </div>
      </div>

      <div className="card space-y-2">
        <h2 className="text-lg font-semibold">Share link</h2>
        <button className="button" onClick={createShare}>
          Create share link
        </button>
        {share && (
          <p className="text-emerald-300 text-sm">
            Share URL: <Link href={`/share/${share.token}`}>{`/share/${share.token}`}</Link>
          </p>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
