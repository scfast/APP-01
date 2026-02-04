import { admin } from "@/lib/firebaseAdmin";

export function getBucket() {
  return admin.storage().bucket();
}

export async function uploadToStorage(
  path: string,
  data: Buffer,
  contentType?: string
) {
  const bucket = getBucket();
  const file = bucket.file(path);
  await file.save(data, {
    contentType: contentType || "application/octet-stream",
    resumable: false,
    public: false
  });

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-01-2500"
  });

  return { storagePath: path, publicUrl: url };
}
