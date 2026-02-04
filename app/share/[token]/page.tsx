"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ShareData = {
  file: {
    _id: string;
    filename: string;
    ownerEmail: string;
    storagePath?: string;
    publicUrl?: string;
  };
};

export default function SharePage() {
  const params = useParams();
  const token = params?.token as string;
  const [data, setData] = useState<ShareData | null>(null);

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`/api/share/${token}`);
      const json = await res.json();
      setData(json);
    };
    if (token) run();
  }, [token]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="card space-y-2">
      <h1 className="text-2xl font-bold">Shared file</h1>
      <p className="text-slate-300">File: {data.file.filename}</p>
      <p className="text-slate-300">Owner: {data.file.ownerEmail}</p>
      <p className="text-slate-300">Storage path: {data.file.storagePath}</p>
      <div className="flex gap-3 flex-wrap">
        <a
          className="button"
          href={data.file.publicUrl || `/api/files/${data.file._id}/download`}
        >
          Download
        </a>
        {data.file.publicUrl && (
          <a className="button-muted" href={data.file.publicUrl}>
            Public URL
          </a>
        )}
        <Link className="button-muted" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}
